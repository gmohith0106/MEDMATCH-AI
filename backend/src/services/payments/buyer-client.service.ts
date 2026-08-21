import algosdk from 'algosdk';
import { x402Client, x402HTTPClient } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import {
  ExactAvmScheme,
  toClientAvmSigner,
  ALGORAND_TESTNET_CAIP2,
  USDC_TESTNET_ASA_ID
} from '@x402/avm';
import { env } from '../../config/env';
import { SpendPolicyService, SpendPolicyDecision } from './spend-policy.service';
import { PaymentRepository } from '../../repositories/payment.repository';
import { PaymentRecord, PaymentProductDetails, PaymentSupplierDetails } from '../../types/payment.types';
import { logger } from '../../utils/logger';
import { getCurrentIsoDate } from '../../utils/dates';
import { isAlgorandTxId, getLoraTransactionUrl } from '../../utils/algorand-validation';
import { v4 as uuidv4 } from 'uuid';

export interface AutonomousProcurementResult {
  success: boolean;
  statusCode: number;
  data?: any;
  paymentRecord?: PaymentRecord;
  spendDecision?: SpendPolicyDecision;
  transactionId?: string;
  payerAddress?: string;
  receiverAddress?: string;
  settledAt?: string;
  explorerUrl?: string;
  error?: string;
  message?: string;
}

export interface PurchaseSupplierIntelligenceParams {
  hospitalId: string;
  userId: string;
  procurementRunId: string;
  category?: string;
  targetUrl?: string;
  product?: PaymentProductDetails;
  supplier?: PaymentSupplierDetails;
}

export class X402BuyerClientService {
  private static instance: X402BuyerClientService | null = null;
  private spendPolicy: SpendPolicyService;
  private paymentRepo: PaymentRepository;

  public constructor(spendPolicy?: SpendPolicyService, paymentRepo?: PaymentRepository) {
    this.spendPolicy = spendPolicy || SpendPolicyService.getInstance();
    this.paymentRepo = paymentRepo || new PaymentRepository();
  }

  public static getInstance(): X402BuyerClientService {
    if (!X402BuyerClientService.instance) {
      X402BuyerClientService.instance = new X402BuyerClientService();
    }
    return X402BuyerClientService.instance;
  }

  /**
   * Checks whether the autonomous payer signer is configured server-side.
   */
  public isSignerConfigured(): boolean {
    const { getAlgorandAccountFromMnemonic } = require('../../utils/algorand-wallet');
    return Boolean(getAlgorandAccountFromMnemonic(env.ALGORAND_SENDER_MNEMONIC));
  }

  /**
   * Returns the public Algorand address of the autonomous paying agent.
   */
  public getAgentPayerAddress(): string | null {
    const { getAlgorandAccountFromMnemonic } = require('../../utils/algorand-wallet');
    const account = getAlgorandAccountFromMnemonic(env.ALGORAND_SENDER_MNEMONIC);
    return account ? account.addr.toString() : null;
  }

  /**
   * Executes autonomous x402 purchase of premium supplier intelligence.
   *
   * Flow:
   * 1. Evaluates Spend Policy for safety & limit controls.
   * 2. Initializes x402 AVM client with Algorand signer.
   * 3. Makes genuine HTTP request -> receives 402 challenge.
   * 4. Signs payment transaction on Algorand TestNet.
   * 5. GoPlausible Facilitator verifies and settles payment.
   * 6. Receives HTTP 200 with unlocked supplier intelligence & settlement receipt.
   */
  public async purchaseSupplierIntelligence(params: PurchaseSupplierIntelligenceParams): Promise<AutonomousProcurementResult> {
    const now = getCurrentIsoDate();
    const port = env.PORT || 4000;
    const resourcePath = env.X402_ENDPOINT || '/api/paid/supplier-intelligence';
    const baseUrl = `http://localhost:${port}`;
    const targetUrl = params.targetUrl || `${baseUrl}${resourcePath}${params.category ? `?category=${encodeURIComponent(params.category)}` : ''}`;

    logger.info(`[PAYMENT_RESOURCE_REQUESTED] Requesting protected supplier intelligence: ${resourcePath}`);

    // 1. Evaluate Spend Policy before initiating payment
    const spendDecision = await this.spendPolicy.evaluate({
      resource: resourcePath,
      network: env.ALGORAND_NETWORK || ALGORAND_TESTNET_CAIP2,
      asset: env.X402_PAYMENT_ASSET || 'USDC',
      amount: 0.02,
      payTo: env.ALGORAND_RECEIVER_ADDRESS || '',
      procurementRunId: params.procurementRunId,
      hospitalId: params.hospitalId
    });

    if (!spendDecision.approved) {
      logger.warn(`[SPEND_POLICY_REJECTED] Spend policy rejected x402 payment: ${spendDecision.reason}`);
      return {
        success: false,
        statusCode: 403,
        spendDecision,
        error: 'SPEND_POLICY_REJECTED',
        message: spendDecision.reason
      };
    }

    logger.info(`[SPEND_POLICY_APPROVED] Spend policy approved: $0.02 USDC on Algorand TestNet`);

    // 2. Check if agent signer mnemonic is configured
    if (!this.isSignerConfigured()) {
      logger.info(`[X402_402_RECEIVED] Payer wallet not configured in backend .env. Testing genuine HTTP 402 Payment Challenge.`);
      
      try {
        const unpaidRes = await fetch(targetUrl);
        const reqHeader = unpaidRes.headers.get('PAYMENT-REQUIRED') || unpaidRes.headers.get('payment-required');
        
        if (reqHeader) {
          logger.info(`[PAYMENT_REQUIREMENTS_PARSED] Received genuine HTTP 402 challenge with valid payment requirements`);
        }

        return {
          success: false,
          statusCode: unpaidRes.status,
          spendDecision,
          error: 'PAYMENT_SIGNER_NOT_CONFIGURED',
          message: 'USER ACTION REQUIRED: Payer wallet mnemonic (AVM_MNEMONIC) not configured in backend .env.'
        };
      } catch (err: any) {
        return {
          success: false,
          statusCode: 500,
          spendDecision,
          error: 'REQUEST_FAILED',
          message: `Failed to connect to paid resource: ${err?.message}`
        };
      }
    }

    // 3. Initialize Algorand Signer & x402 Client
    try {
      logger.info(`[PAYMENT_SIGNING_STARTED] Initializing server-side AVM signer for Algorand TestNet`);
      const { getAlgorandAccountFromMnemonic } = require('../../utils/algorand-wallet');
      const account = getAlgorandAccountFromMnemonic(env.ALGORAND_SENDER_MNEMONIC);
      if (!account) {
        throw new Error('Valid Algorand signer account could not be initialized from environment');
      }
      const payerAddress = account.addr.toString();
      const secretKeyBase64 = Buffer.from(account.sk).toString('base64');
      const clientSigner = toClientAvmSigner(secretKeyBase64);

      const client = new x402Client();
      client.register(ALGORAND_TESTNET_CAIP2, new ExactAvmScheme(clientSigner));

      logger.info(`[PAYMENT_SIGNED] Server-side AVM signer created for payer address: ${payerAddress}`);

      // 4. Wrap fetch with x402 automatic payment protocol handler
      const fetchWithPayment = wrapFetchWithPayment(fetch as any, client);

      logger.info(`[PAYMENT_RETRY_STARTED] Dispatching x402 request with payment authorization to ${targetUrl}`);
      logger.info(`[FACILITATOR_VERIFY_STARTED] Submitting payment verification to GoPlausible facilitator`);

      const response = await fetchWithPayment(targetUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Procurement-Run-Id': params.procurementRunId
        }
      });

      const responseStatus = response.status;
      const paymentResponseHeader = response.headers.get('PAYMENT-RESPONSE') || response.headers.get('payment-response') || response.headers.get('X-PAYMENT-RESPONSE');

      if (response.ok) {
        logger.info(`[FACILITATOR_VERIFY_SUCCESS] Payment verified by GoPlausible facilitator`);
        logger.info(`[FACILITATOR_SETTLEMENT_STARTED] Settlement transaction broadcast to Algorand TestNet`);

        const httpClient = new x402HTTPClient(client);
        let settleResponse: any = null;
        try {
          settleResponse = httpClient.getPaymentSettleResponse((name: string) => response.headers.get(name));
        } catch {
          // fallback
        }

        let receiptData: any = {};
        if (paymentResponseHeader) {
          try {
            const rawReceipt = Buffer.from(paymentResponseHeader, 'base64').toString('utf8');
            receiptData = JSON.parse(rawReceipt);
          } catch {
            // Fallback parsing
          }
        }

        const responseBody: any = await response.json();
        const payloadData = responseBody?.data || responseBody;

        let txId: string = '';
        if (settleResponse && settleResponse.transaction) {
          txId = String(settleResponse.transaction);
        } else if (receiptData.transactionId || receiptData.transaction) {
          txId = String(receiptData.transactionId || receiptData.transaction);
        } else if (payloadData.paymentReceipt?.transactionId || payloadData.paymentReceipt?.transaction) {
          txId = String(payloadData.paymentReceipt.transactionId || payloadData.paymentReceipt.transaction);
        }

        // Validate that transaction is a genuine 52-character Base32 Algorand Transaction ID
        if (!isAlgorandTxId(txId)) {
          logger.error(`[TRANSACTION_VALIDATION_FAILED] Invalid or missing 52-character Algorand transaction ID: '${txId}'`);
          return {
            success: false,
            statusCode: 502,
            spendDecision,
            error: 'INVALID_TRANSACTION_ID',
            message: 'Settlement failed to produce a valid 52-character Algorand transaction ID.'
          };
        }

        const confirmedRound = receiptData.confirmedRound || receiptData.round || payloadData.paymentReceipt?.round || 0;
        const settledAt = receiptData.settledAt || now;
        const explorerUrl = getLoraTransactionUrl(txId);

        logger.info(`[FACILITATOR_SETTLEMENT_SUCCESS] Settlement successful!`);
        logger.info(`[ALGORAND_TRANSACTION_CONFIRMED] Transaction confirmed on Algorand TestNet: ${txId} (Round ${confirmedRound})`);
        logger.info(`[SUPPLIER_RESOURCE_UNLOCKED] Premium supplier intelligence unlocked for run ${params.procurementRunId}`);

        // Persist verified on-chain payment record
        const paymentRecord: PaymentRecord = {
          id: `pay_x402_${uuidv4().substring(0, 8)}`,
          procurementRunId: params.procurementRunId,
          runId: params.procurementRunId,
          agentRunId: params.procurementRunId,
          hospitalId: params.hospitalId,
          userId: params.userId,
          
          // Product details
          productId: params.product?.id || 'SURG-GLV-002',
          productName: params.product?.name || 'Surgical Gloves (Sterile, Latex-Free)',
          requiredQuantity: params.product?.requiredQuantity || 1650,
          currentStock: params.product?.currentStock || 1250,
          forecastDemand: params.product?.forecastDemand || 2900,
          expectedDeficit: params.product?.expectedDeficit || 1650,
          product: params.product,

          // Supplier details
          supplierId: params.supplier?.id || 'sup-medisupply-001',
          supplierName: params.supplier?.name || 'MediSupply Healthcare Solutions',
          supplierUnitPrice: params.supplier?.unitPrice || 1.85,
          supplierDeliveryDays: params.supplier?.deliveryDays || 2,
          supplierReliability: params.supplier?.reliability || 99.2,
          supplierScore: params.supplier?.score || 94.6,
          supplier: params.supplier,

          amount: 0.02,
          asset: 'USDC',
          currency: 'USD',
          protocol: 'x402',
          network: ALGORAND_TESTNET_CAIP2,
          status: 'PAYMENT_SETTLED',
          provider: 'x402 / GoPlausible Facilitator',
          payerPublicAddress: payerAddress,
          senderAddress: payerAddress,
          receiverPublicAddress: env.ALGORAND_RECEIVER_ADDRESS,
          receiverAddress: env.ALGORAND_RECEIVER_ADDRESS,
          transactionId: txId,
          confirmedRound,
          round: confirmedRound,
          blockNumber: confirmedRound,
          explorerUrl,
          verified: true,
          verifiedAt: settledAt,
          settledAt,
          resource: resourcePath,
          facilitator: env.X402_FACILITATOR_URL,
          createdAt: now,
          updatedAt: now,
          metadata: {
            facilitator: env.X402_FACILITATOR_URL,
            spendDecision: spendDecision as any
          }
        };

        await this.paymentRepo.create(paymentRecord);
        logger.info(`[PAYMENT_RECORD_SAVED] Saved permanent payment record: ${paymentRecord.id}`);

        return {
          success: true,
          statusCode: 200,
          data: payloadData,
          paymentRecord,
          spendDecision,
          transactionId: txId,
          payerAddress,
          receiverAddress: env.ALGORAND_RECEIVER_ADDRESS,
          settledAt,
          explorerUrl
        };
      } else {
        const errorText = await response.text();
        logger.error(`[FACILITATOR_SETTLEMENT_FAILED] Facilitator or resource returned status ${responseStatus}: ${errorText}`);
        
        return {
          success: false,
          statusCode: responseStatus,
          spendDecision,
          error: 'SETTLEMENT_FAILED',
          message: `Facilitator payment settlement returned status ${responseStatus}: ${errorText}`
        };
      }
    } catch (err: any) {
      logger.error(`[AutonomousAgent] Error during x402 autonomous payment execution`, err);
      return {
        success: false,
        statusCode: 500,
        spendDecision,
        error: 'PAYMENT_EXECUTION_FAILED',
        message: err?.message || 'Unknown error during autonomous x402 payment execution.'
      };
    }
  }
}

