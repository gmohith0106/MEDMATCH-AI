import { v4 as uuidv4 } from 'uuid';
import {
  CreatePaymentRequestParams,
  PaymentService,
  SubmitPaymentParams
} from './payment.interface';
import {
  PaymentConfigStatus,
  PaymentRecord,
  PaymentRequestResult,
  PaymentVerificationResult,
  X402PaymentRequirement
} from '../../types/payment.types';
import { PaymentRepository } from '../../repositories/payment.repository';
import { AlgorandService } from '../algorand/algorand.interface';
import { AlgorandServiceImpl } from '../algorand/algorand.service';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import { getCurrentIsoDate } from '../../utils/dates';
import { logger } from '../../utils/logger';

export class X402PaymentService implements PaymentService {
  public readonly mode = 'x402' as const;
  private paymentRepo: PaymentRepository;
  private algorandService: AlgorandService;

  constructor(paymentRepo?: PaymentRepository, algorandService?: AlgorandService) {
    this.paymentRepo = paymentRepo || new PaymentRepository();
    this.algorandService = algorandService || new AlgorandServiceImpl();
  }

  generate402Header(requirement: X402PaymentRequirement): string {
    const jsonStr = JSON.stringify(requirement);
    return Buffer.from(jsonStr, 'utf8').toString('base64');
  }

  parse402Header(headerValue: string): X402PaymentRequirement | null {
    try {
      if (!headerValue) return null;
      // Handle optional 'x402 ' or 'Bearer ' prefix
      const cleanBase64 = headerValue.replace(/^(x402|Bearer)\s+/i, '').trim();
      const jsonStr = Buffer.from(cleanBase64, 'base64').toString('utf8');
      return JSON.parse(jsonStr) as X402PaymentRequirement;
    } catch {
      return null;
    }
  }

  async getConfigStatus(): Promise<PaymentConfigStatus> {
    const network = this.algorandService.getNetwork();
    const nodeUrl = env.ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud';
    const indexerUrl = env.ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud';
    const receiverAddress = env.ALGORAND_RECEIVER_ADDRESS || 'ALGORAND_RECEIVER_ADDRESS_UNSET';
    const isReceiverConfigured = !!env.ALGORAND_RECEIVER_ADDRESS && env.ALGORAND_RECEIVER_ADDRESS.length === 58;
    const isSenderConfigured = !!env.ALGORAND_SENDER_MNEMONIC && env.ALGORAND_SENDER_MNEMONIC.trim().split(/\s+/).length >= 24;

    const health = await this.algorandService.checkHealth();

    const isConfigured = isReceiverConfigured && health.algodHealthy && health.indexerHealthy;

    let overallStatus: 'CONNECTED' | 'CONFIGURATION_REQUIRED' | 'FAILED' = 'CONNECTED';
    let message = 'x402 payment protocol and Algorand TestNet connection active.';

    if (!health.algodHealthy || !health.indexerHealthy) {
      overallStatus = 'FAILED';
      message = 'Algorand TestNet node or indexer connection failed.';
    } else if (!isReceiverConfigured) {
      overallStatus = 'CONFIGURATION_REQUIRED';
      message = 'Payment integration requires receiver address configuration.';
    }

    return {
      x402: {
        enabled: true,
        configured: isConfigured,
        facilitatorUrl: env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz',
        mode: 'x402'
      },
      algorand: {
        network,
        nodeUrl,
        indexerUrl,
        receiverAddressConfigured: isReceiverConfigured,
        receiverAddress: isReceiverConfigured ? receiverAddress : undefined,
        senderAccountConfigured: isSenderConfigured,
        nodeConnected: health.algodHealthy,
        indexerConnected: health.indexerHealthy
      },
      overallStatus,
      message
    };
  }

  async createPaymentRequirement(params: CreatePaymentRequestParams): Promise<PaymentRequestResult> {
    const paymentId = `pay_x402_${uuidv4().substring(0, 8)}`;
    const now = getCurrentIsoDate();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min TTL

    const amount = params.amount !== undefined ? params.amount : 0.02;
    const asset = params.asset || 'ALGO';
    const currency = params.currency || 'USD';
    const network = this.algorandService.getNetwork();
    const payTo = env.ALGORAND_RECEIVER_ADDRESS || 'ALGORAND_RECEIVER_ADDRESS_UNSET';
    const resource = params.resource || env.X402_ENDPOINT || '/api/paid/supplier-intelligence';
    const description = params.purpose || 'Autonomous Agent Tier-1 Supplier Intelligence Oracle Fee';

    const requirement: X402PaymentRequirement = {
      scheme: 'exact',
      network,
      asset,
      amount,
      amountRaw: Math.round(amount * 1_000_000).toString(),
      payTo,
      facilitatorUrl: env.X402_FACILITATOR_URL,
      paymentId,
      resource,
      expiresAt,
      description
    };

    const headerPayloadBase64 = this.generate402Header(requirement);

    const paymentRecord: PaymentRecord = {
      id: paymentId,
      runId: params.runId,
      agentRunId: params.agentRunId || params.runId,
      hospitalId: params.hospitalId,
      userId: params.userId,
      amount,
      asset,
      currency,
      protocol: 'x402',
      network,
      status: 'PAYMENT_REQUIRED',
      provider: 'x402 / Algorand Smart Settlement',
      receiverAddress: payTo,
      verified: false,
      paymentRequirements: requirement,
      resource,
      createdAt: now,
      updatedAt: now,
      metadata: {
        facilitatorUrl: env.X402_FACILITATOR_URL,
        ...params.metadata
      }
    };

    await this.paymentRepo.create(paymentRecord);
    logger.info(`[X402PaymentService] Created real x402 payment requirement: ${paymentId}`);

    return {
      paymentId,
      amount,
      asset,
      currency,
      protocol: 'x402',
      network,
      status: 'PAYMENT_REQUIRED',
      payToAddress: payTo,
      facilitatorUrl: env.X402_FACILITATOR_URL,
      paymentRequirement: requirement,
      headerPayloadBase64,
      expiresAt
    };
  }

  async submitPayment(params: SubmitPaymentParams): Promise<PaymentRecord> {
    const existing = await this.paymentRepo.findById(params.paymentId);
    if (!existing) {
      throw new AppError(`Payment record ${params.paymentId} not found`, 404, 'RESOURCE_NOT_FOUND');
    }

    const now = getCurrentIsoDate();
    const updated = await this.paymentRepo.update(params.paymentId, {
      status: 'PAYMENT_SUBMITTED',
      transactionId: params.transactionId || existing.transactionId,
      senderAddress: params.senderAddress || existing.senderAddress,
      receiverAddress: params.receiverAddress || existing.receiverAddress,
      updatedAt: now
    });

    if (!updated) {
      throw new AppError('Failed to update payment record status', 500, 'PAYMENT_FAILED');
    }

    logger.info(`[X402PaymentService] Payment ${params.paymentId} submitted with Txn: ${params.transactionId || 'Pending'}`);
    return updated;
  }

  async verifyPayment(paymentId: string, txId?: string): Promise<PaymentVerificationResult> {
    const existing = await this.paymentRepo.findById(paymentId);
    if (!existing) {
      throw new AppError(`Payment record ${paymentId} not found`, 404, 'RESOURCE_NOT_FOUND');
    }

    const targetTxId = txId || existing.transactionId;
    if (!targetTxId || targetTxId.trim() === '') {
      // If agent automated execution is available via configured mnemonic, attempt payment execution
      if (env.ALGORAND_SENDER_MNEMONIC && existing.receiverAddress && existing.receiverAddress.length === 58) {
        logger.info(`[X402PaymentService] Executing automated payment for ${paymentId} via agent wallet`);
        try {
          const autoTx = await this.algorandService.sendPayment(
            existing.receiverAddress,
            existing.amount,
            `x402:${paymentId}`
          );
          return this.finalizeVerification(paymentId, autoTx.transactionId);
        } catch (err: any) {
          logger.error(`[X402PaymentService] Automated on-chain payment failed`, err);
          throw new AppError(`On-chain payment execution failed: ${err.message}`, 500, 'PAYMENT_FAILED');
        }
      }

      throw new AppError(
        `Transaction ID required for verification of payment ${paymentId}`,
        400,
        'PAYMENT_REQUIRED'
      );
    }

    return this.finalizeVerification(paymentId, targetTxId);
  }

  private async finalizeVerification(paymentId: string, txId: string): Promise<PaymentVerificationResult> {
    const now = getCurrentIsoDate();
    const existing = await this.paymentRepo.findById(paymentId);

    // Verify against Algorand TestNet on-chain indexer/node
    const onChainTx = await this.algorandService.verifyTransaction(
      txId,
      existing?.receiverAddress,
      existing?.amount
    );

    const explorerUrl = this.algorandService.getExplorerUrl(txId);

    const updated = await this.paymentRepo.update(paymentId, {
      status: 'PAYMENT_SETTLED',
      transactionId: txId,
      senderAddress: onChainTx.sender || existing?.senderAddress,
      receiverAddress: onChainTx.receiver || existing?.receiverAddress,
      confirmedRound: onChainTx.confirmedRound,
      blockNumber: onChainTx.confirmedRound,
      explorerUrl,
      verified: true,
      verifiedAt: now,
      settledAt: onChainTx.timestamp || now,
      updatedAt: now
    });

    logger.info(`[X402PaymentService] Successfully verified & settled payment ${paymentId} on-chain (Txn: ${txId})`);

    return {
      paymentId,
      transactionId: txId,
      senderAddress: updated?.senderAddress,
      receiverAddress: updated?.receiverAddress,
      amount: updated?.amount,
      asset: updated?.asset,
      network: this.algorandService.getNetwork(),
      status: 'PAYMENT_SETTLED',
      verified: true,
      confirmedRound: updated?.confirmedRound,
      blockNumber: updated?.blockNumber,
      explorerUrl,
      verifiedAt: updated?.verifiedAt,
      settledAt: updated?.settledAt
    };
  }

  async getPaymentById(paymentId: string): Promise<PaymentRecord | null> {
    return this.paymentRepo.findById(paymentId);
  }

  async getPaymentsByHospital(hospitalId: string): Promise<PaymentRecord[]> {
    return this.paymentRepo.findByHospital(hospitalId);
  }
}

