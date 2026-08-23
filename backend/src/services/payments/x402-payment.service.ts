import { v4 as uuidv4 } from 'uuid';
import algosdk from 'algosdk';
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
import { ALGORAND_TESTNET_CAIP2 } from '../../config/constants';

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
    const receiverAddress = env.ALGORAND_RECEIVER_ADDRESS;
    const isReceiverConfigured = Boolean(
      receiverAddress &&
      receiverAddress.length === 58 &&
      algosdk.isValidAddress(receiverAddress)
    );
    const isSenderConfigured = Boolean(
      env.ALGORAND_SENDER_MNEMONIC &&
      env.ALGORAND_SENDER_MNEMONIC.trim().split(/\s+/).length >= 24
    );

    const health = await this.algorandService.checkHealth();
    const isConfigured = isReceiverConfigured && health.algodHealthy && health.indexerHealthy;

    let overallStatus: 'CONNECTED' | 'CONFIGURATION_REQUIRED' | 'FAILED' = 'CONNECTED';
    let message = 'x402 payment protocol and Algorand TestNet connection active.';

    if (!health.algodHealthy || !health.indexerHealthy) {
      overallStatus = 'FAILED';
      message = 'Algorand TestNet node or indexer connection failed.';
    } else if (!isReceiverConfigured) {
      overallStatus = 'CONFIGURATION_REQUIRED';
      message = 'Payment integration requires valid 58-character receiver address configuration.';
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
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const amount = params.amount !== undefined ? params.amount : 0.001;
    const asset = params.asset || (env.X402_PAYMENT_ASSET as 'ALGO' | 'USDC') || 'USDC';
    const currency = params.currency || 'USD';
    const network = this.algorandService.getNetwork() || ALGORAND_TESTNET_CAIP2;
    const payTo = env.ALGORAND_RECEIVER_ADDRESS || '';
    const resource = params.resource || env.X402_ENDPOINT || '/api/paid/supplier-intelligence';
    const description = params.purpose || 'Tier-1 Certified Healthcare Supplier Network SLA & Capacity Matrix';

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

  /**
   * Create an official client-signed x402 payment payload using @x402/core & @x402/avm
   * when agent wallet mnemonic is configured.
   */
  async createClientPaymentPayload(requirement: X402PaymentRequirement): Promise<{
    paymentPayload: unknown;
    header: Record<string, string>;
  } | null> {
    if (!env.ALGORAND_SENDER_MNEMONIC) {
      return null;
    }

    try {
      const { toClientAvmSigner, ExactAvmScheme: ClientExactAvmScheme } = require('@x402/avm');
      const { x402Client, x402HTTPClient } = require('@x402/core/client');

      const account = algosdk.mnemonicToSecretKey(env.ALGORAND_SENDER_MNEMONIC);
      const secretKeyBase64 = Buffer.from(account.sk).toString('base64');
      const clientSigner = toClientAvmSigner(secretKeyBase64);

      const client = new x402Client();
      client.register(ALGORAND_TESTNET_CAIP2, new ClientExactAvmScheme(clientSigner));

      const httpClient = new x402HTTPClient(client);

      const paymentRequiredObj = {
        x402Version: 2,
        resource: {
          url: requirement.resource,
          description: requirement.description,
          mimeType: 'application/json'
        },
        accepts: [
          {
            scheme: requirement.scheme,
            network: requirement.network as `${string}:${string}`,
            amount: requirement.amountRaw || String(Math.round(requirement.amount * 1_000_000)),
            asset: requirement.asset,
            payTo: requirement.payTo,
            maxTimeoutSeconds: 900
          }
        ]
      };

      const payload = await client.createPaymentPayload(paymentRequiredObj as any);
      const header = httpClient.encodePaymentSignatureHeader(payload);

      return {
        paymentPayload: payload,
        header
      };
    } catch (error) {
      logger.error('[X402PaymentService] Failed to create client x402 payment payload', error);
      return null;
    }
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

    // If already verified or settled, return current record
    if (existing.status === 'PAYMENT_SETTLED' && existing.transactionId) {
      return {
        paymentId: existing.id,
        transactionId: existing.transactionId,
        senderAddress: existing.senderAddress,
        receiverAddress: existing.receiverAddress,
        amount: existing.amount,
        asset: existing.asset,
        network: existing.network,
        status: 'PAYMENT_SETTLED',
        verified: true,
        confirmedRound: existing.confirmedRound,
        blockNumber: existing.blockNumber,
        explorerUrl: existing.explorerUrl,
        verifiedAt: existing.verifiedAt,
        settledAt: existing.settledAt
      };
    }

    const targetTxId = txId || existing.transactionId;

    if (!targetTxId || targetTxId.trim() === '') {
      // If autonomous agent payer wallet is configured, execute real Algorand payment
      if (env.ALGORAND_SENDER_MNEMONIC && existing.receiverAddress && algosdk.isValidAddress(existing.receiverAddress)) {
        logger.info(`[X402PaymentService] Executing autonomous on-chain TestNet payment for ${paymentId}`);
        try {
          const autoTx = await this.algorandService.sendPayment(
            existing.receiverAddress,
            existing.amount,
            `x402:${paymentId}`
          );
          return this.finalizeVerification(paymentId, autoTx.transactionId);
        } catch (err: any) {
          logger.error(`[X402PaymentService] Autonomous on-chain payment failed`, err);
          throw new AppError(`On-chain payment execution failed: ${err.message}`, 500, 'PAYMENT_FAILED');
        }
      }

      throw new AppError(
        `Transaction ID required for on-chain verification of payment ${paymentId}`,
        400,
        'PAYMENT_REQUIRED'
      );
    }

    return this.finalizeVerification(paymentId, targetTxId);
  }

  private async finalizeVerification(paymentId: string, txId: string): Promise<PaymentVerificationResult> {
    const now = getCurrentIsoDate();
    const existing = await this.paymentRepo.findById(paymentId);

    // Replay protection: Check if transaction has already been used in another payment
    const allPayments = await this.paymentRepo.findByHospital(existing?.hospitalId || 'hospital-citycare-001');
    const duplicate = allPayments.find(
      (p) => p.id !== paymentId && p.transactionId === txId && (p.status === 'PAYMENT_SETTLED' || p.status === 'PAYMENT_VERIFIED')
    );
    if (duplicate) {
      throw new AppError(
        `Replay attack detected: Transaction ${txId} has already been settled for payment ${duplicate.id}`,
        400,
        'PAYMENT_ALREADY_USED'
      );
    }

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
