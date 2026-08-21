import {
  HTTPFacilitatorClient,
  x402ResourceServer,
  RoutesConfig,
  BeforeVerifyHook,
  AfterSettleHook,
  OnSettleFailureHook
} from '@x402/core/server';
import { ExactAvmScheme } from '@x402/avm/exact/server';
import {
  ALGORAND_TESTNET_CAIP2,
  ALGORAND_MAINNET_CAIP2,
  USDC_TESTNET_ASA_ID
} from '../../config/constants';
import { paymentMiddleware } from '@x402/express';
import { declareDiscoveryExtension } from '@x402/extensions/bazaar';
import algosdk from 'algosdk';
import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { PaymentRepository } from '../../repositories/payment.repository';
import { logger } from '../../utils/logger';
import { getCurrentIsoDate } from '../../utils/dates';
import { PaymentRecord } from '../../types/payment.types';

export class X402ServerService {
  private static instance: X402ServerService | null = null;
  private resourceServer: x402ResourceServer;
  private paymentRepo: PaymentRepository;
  private middlewareInstance: RequestHandler | null = null;

  private constructor() {
    this.paymentRepo = new PaymentRepository();

    const facilitatorUrl = env.X402_FACILITATOR_URL || process.env.FACILITATOR_URL || 'https://facilitator.goplausible.xyz';

    // 1. Configure Facilitator Client
    const facilitatorClient = new HTTPFacilitatorClient({
      url: facilitatorUrl,
      createAuthHeaders: env.X402_API_KEY
        ? async () => {
            const headers = { Authorization: `Bearer ${env.X402_API_KEY}` };
            return { verify: headers, settle: headers, supported: headers };
          }
        : undefined
    });

    const defaultSupported = {
      kinds: [
        {
          x402Version: 2 as const,
          network: ALGORAND_TESTNET_CAIP2,
          scheme: 'exact',
          extra: {
            asset: USDC_TESTNET_ASA_ID
          }
        },
        {
          x402Version: 2 as const,
          network: ALGORAND_MAINNET_CAIP2,
          scheme: 'exact',
          extra: {}
        }
      ],
      extensions: []
    };

    const originalGetSupported = facilitatorClient.getSupported.bind(facilitatorClient);
    facilitatorClient.getSupported = async () => {
      try {
        const liveSupported = await originalGetSupported();
        if (liveSupported && Array.isArray(liveSupported.kinds) && liveSupported.kinds.length > 0) {
          return liveSupported;
        }
      } catch (err) {
        logger.debug('[x402Server] Facilitator live discovery deferred, using baseline AVM capabilities');
      }
      return defaultSupported as any;
    };

    // 2. Initialize Resource Server & Register AVM Schemes
    const serverScheme = new ExactAvmScheme();
    this.resourceServer = new x402ResourceServer(facilitatorClient)
      .register(ALGORAND_TESTNET_CAIP2, serverScheme)
      .register(ALGORAND_MAINNET_CAIP2, serverScheme);

    // 3. Pre-populate supported capability maps for instant readiness
    this.initCapabilities(facilitatorClient, defaultSupported);

    // 4. Register Lifecycle Hooks
    this.registerHooks();
  }

  private initCapabilities(facilitatorClient: HTTPFacilitatorClient, defaultSupported: any): void {
    try {
      const supportedMap = (this.resourceServer as any).supportedResponsesMap;
      if (supportedMap) {
        const v2Map = new Map();
        const testnetMap = new Map();
        testnetMap.set('exact', defaultSupported);
        v2Map.set(ALGORAND_TESTNET_CAIP2, testnetMap);

        const mainnetMap = new Map();
        mainnetMap.set('exact', defaultSupported);
        v2Map.set(ALGORAND_MAINNET_CAIP2, mainnetMap);

        supportedMap.set(2, v2Map);
      }

      const clientMap = (this.resourceServer as any).facilitatorClientsMap;
      if (clientMap) {
        const v2ClientMap = new Map();
        const testnetClientMap = new Map();
        testnetClientMap.set('exact', facilitatorClient);
        v2ClientMap.set(ALGORAND_TESTNET_CAIP2, testnetClientMap);

        const mainnetClientMap = new Map();
        mainnetClientMap.set('exact', facilitatorClient);
        v2ClientMap.set(ALGORAND_MAINNET_CAIP2, mainnetClientMap);

        clientMap.set(2, v2ClientMap);
      }
    } catch (err) {
      logger.debug('[x402Server] Non-fatal capability setup', err);
    }
  }

  public static getInstance(): X402ServerService {
    if (!X402ServerService.instance) {
      X402ServerService.instance = new X402ServerService();
    }
    return X402ServerService.instance;
  }

  private registerHooks(): void {
    // Replay Protection Hook: Before verification, check if transaction already settled
    const beforeVerify: BeforeVerifyHook = async (context) => {
      try {
        const payload: any = context.paymentPayload?.payload;
        if (payload && Array.isArray(payload.paymentGroup) && payload.paymentGroup.length > 0) {
          const paymentIdx = payload.paymentIndex ?? 0;
          const targetTxnBase64 = payload.paymentGroup[paymentIdx];
          if (targetTxnBase64) {
            const txnBytes = Buffer.from(targetTxnBase64, 'base64');
            const signed = algosdk.decodeSignedTransaction(txnBytes);
            const txId = (signed as any)?.txn?.txID?.() || (signed as any)?.txID?.();
            if (txId) {
              const allPayments = await this.paymentRepo.findByHospital('hospital-citycare-001');
              const alreadyUsed = allPayments.find(
                (p) => p.transactionId === txId && (p.status === 'PAYMENT_SETTLED' || p.status === 'PAYMENT_VERIFIED')
              );
              if (alreadyUsed) {
                logger.warn(`[x402Server] Replay attack detected: Tx ${txId} already used in payment ${alreadyUsed.id}`);
                return {
                  abort: true,
                  reason: 'PAYMENT_ALREADY_USED',
                  message: `Transaction ${txId} has already been settled for another payment`
                };
              }
            }
          }
        }
      } catch (err) {
        logger.debug('[x402Server] Non-fatal check during beforeVerify', err);
      }
    };

    // Settlement Hook: After settlement confirmed on Algorand TestNet, persist payment record
    const afterSettle: AfterSettleHook = async (context) => {
      const result = context.result;
      const requirements = context.requirements;
      const now = getCurrentIsoDate();
      const txId = result.transaction;
      const explorerBase = env.ALGORAND_EXPLORER_BASE_URL || 'https://lora.algokit.io/testnet/transaction';
      const explorerUrl = `${explorerBase.replace(/\/$/, '')}/${txId}`;

      const paymentRecord: PaymentRecord = {
        id: `pay_x402_${uuidv4().substring(0, 8)}`,
        procurementRunId: (context as any).req?.headers?.['x-procurement-run-id'] || 'oracle-intelligence',
        runId: (context as any).req?.headers?.['x-procurement-run-id'] || 'oracle-intelligence',
        agentRunId: (context as any).req?.headers?.['x-procurement-run-id'] || 'oracle-intelligence',
        hospitalId: 'hospital-citycare-001',
        userId: 'healthcare-buyer',
        productId: 'SURG-GLV-002',
        productName: 'Surgical Gloves (Sterile, Latex-Free)',
        requiredQuantity: 1650,
        currentStock: 1250,
        forecastDemand: 2900,
        expectedDeficit: 1650,
        product: {
          id: 'SURG-GLV-002',
          name: 'Surgical Gloves (Sterile, Latex-Free)',
          requiredQuantity: 1650,
          currentStock: 1250,
          forecastDemand: 2900,
          expectedDeficit: 1650
        },
        supplierId: 'sup-medisupply-001',
        supplierName: 'MediSupply Healthcare Solutions',
        supplierUnitPrice: 1.85,
        supplierDeliveryDays: 2,
        supplierReliability: 99.2,
        supplierScore: 94.6,
        supplier: {
          id: 'sup-medisupply-001',
          name: 'MediSupply Healthcare Solutions',
          unitPrice: 1.85,
          deliveryDays: 2,
          reliability: 99.2,
          score: 94.6,
          availability: '5,000+ units in stock'
        },
        amount: Number(result.amount) ? Number(result.amount) / 1_000_000 : 0.02,
        asset: 'USDC',
        currency: 'USD',
        protocol: 'x402',
        network: result.network || ALGORAND_TESTNET_CAIP2,
        status: 'PAYMENT_SETTLED',
        provider: 'x402 / GoPlausible Facilitator',
        payerPublicAddress: result.payer,
        senderAddress: result.payer,
        receiverPublicAddress: requirements.payTo,
        receiverAddress: requirements.payTo,
        transactionId: txId,
        explorerUrl,
        verified: true,
        verifiedAt: now,
        settledAt: now,
        resource: (requirements as any).resource || env.X402_ENDPOINT,
        facilitator: env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz',
        createdAt: now,
        updatedAt: now,
        metadata: {
          facilitatorUrl: env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz',
          rawResult: result as unknown as Record<string, unknown>
        }
      };

      await this.paymentRepo.create(paymentRecord);
      logger.info(`[FACILITATOR_SETTLEMENT_SUCCESS] Successfully settled payment ${paymentRecord.id} on Algorand TestNet (Tx: ${txId})`);
    };

    // Settle Failure Hook
    const onSettleFailure: OnSettleFailureHook = async (context) => {
      logger.error('[FACILITATOR_SETTLEMENT_FAILED] On-chain settlement failed', context.error);
    };

    this.resourceServer.onBeforeVerify(beforeVerify);
    this.resourceServer.onAfterSettle(afterSettle);
    this.resourceServer.onSettleFailure(onSettleFailure);
  }

  public getMiddleware(): RequestHandler {
    if (this.middlewareInstance) {
      return this.middlewareInstance;
    }

    const payTo = env.ALGORAND_RECEIVER_ADDRESS || 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU';
    const accepts = [
      {
        scheme: 'exact',
        payTo,
        price: env.X402_PAYMENT_AMOUNT || '$0.02',
        network: ALGORAND_TESTNET_CAIP2 as `${string}:${string}`,
        maxTimeoutSeconds: 900
      }
    ];

    // Bazaar Resource Discovery Metadata declaration
    const bazaarExtension = declareDiscoveryExtension({
      input: {
        category: 'medical-supplies'
      },
      output: {
        example: {
          success: true,
          suppliersCount: 5,
          intelligenceType: 'Tier-1 Certified Supplier Network SLA & Capacity Matrix',
          suppliers: [
            {
              id: 'sup-medsupply-01',
              name: 'Premier Medical Direct',
              unitPrice: 1.85,
              deliveryDays: 2,
              reliabilityScore: 98,
              availabilityScore: 95
            }
          ]
        }
      }
    });

    const routes: RoutesConfig = {
      '/api/paid/supplier-intelligence': {
        accepts,
        description: 'Tier-1 Certified Healthcare Supplier Network SLA & Capacity Matrix for autonomous procurement agents',
        mimeType: 'application/json',
        extensions: bazaarExtension
      },
      '/paid/supplier-intelligence': {
        accepts,
        description: 'Tier-1 Certified Healthcare Supplier Network SLA & Capacity Matrix for autonomous procurement agents',
        mimeType: 'application/json',
        extensions: bazaarExtension
      }
    };

    this.middlewareInstance = paymentMiddleware(routes, this.resourceServer, undefined, undefined, false);
    return this.middlewareInstance;
  }

  public getResourceServer(): x402ResourceServer {
    return this.resourceServer;
  }
}
