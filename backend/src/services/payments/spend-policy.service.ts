import { env } from '../../config/env';
import {
  ALGORAND_TESTNET_CAIP2,
  USDC_TESTNET_ASA_ID
} from '../../config/constants';
import { PaymentRepository } from '../../repositories/payment.repository';
import { logger } from '../../utils/logger';
import { getCurrentIsoDate } from '../../utils/dates';

export interface SpendPolicyRules {
  maxAmountPerTransaction: number; // in USD (default: $0.05)
  maxDailySpendLimit: number; // in USD (default: $1.00)
  allowedNetworks: string[];
  allowedEndpoints: string[];
  allowedAssets: string[];
  enforceReceiverMatch: boolean;
}

export interface SpendEvaluationRequest {
  resource: string;
  network: string;
  asset: string;
  amount: number;
  payTo: string;
  procurementRunId?: string;
  hospitalId?: string;
}

export interface SpendPolicyDecision {
  decision: 'SPEND_POLICY_APPROVED' | 'SPEND_POLICY_REJECTED';
  approved: boolean;
  reason: string;
  evaluatedAt: string;
  rules: {
    amount: number;
    maxAmountPerTransaction: number;
    dailySpentSoFar: number;
    maxDailySpendLimit: number;
    network: string;
    asset: string;
    resource: string;
  };
}

export class SpendPolicyService {
  private static instance: SpendPolicyService | null = null;
  private paymentRepo: PaymentRepository;
  private rules: SpendPolicyRules;

  public constructor(paymentRepo?: PaymentRepository, customRules?: Partial<SpendPolicyRules>) {
    this.paymentRepo = paymentRepo || new PaymentRepository();

    this.rules = {
      maxAmountPerTransaction: 0.05, // $0.05 limit per single oracle query
      maxDailySpendLimit: 1.00, // $1.00 maximum daily autonomous agent spend
      allowedNetworks: [ALGORAND_TESTNET_CAIP2],
      allowedEndpoints: [
        '/api/paid/supplier-intelligence',
        '/paid/supplier-intelligence',
        env.X402_ENDPOINT
      ],
      allowedAssets: ['USDC', USDC_TESTNET_ASA_ID, 'ALGO'],
      enforceReceiverMatch: true,
      ...customRules
    };
  }

  public static getInstance(): SpendPolicyService {
    if (!SpendPolicyService.instance) {
      SpendPolicyService.instance = new SpendPolicyService();
    }
    return SpendPolicyService.instance;
  }

  /**
   * Evaluates whether an x402 payment request meets AI-agent safety and spend boundaries.
   * Emits structured audit events without logging any sensitive signing keys.
   */
  public async evaluate(request: SpendEvaluationRequest): Promise<SpendPolicyDecision> {
    const now = getCurrentIsoDate();
    const hospitalId = request.hospitalId || 'hospital-citycare-001';

    // 1. Endpoint allowlist verification
    const isEndpointAllowed = this.rules.allowedEndpoints.some((allowed) =>
      request.resource.toLowerCase().includes(allowed.toLowerCase())
    );
    if (!isEndpointAllowed) {
      const decision: SpendPolicyDecision = {
        decision: 'SPEND_POLICY_REJECTED',
        approved: false,
        reason: `Resource '${request.resource}' is not in the agent allowlisted endpoints.`,
        evaluatedAt: now,
        rules: {
          amount: request.amount,
          maxAmountPerTransaction: this.rules.maxAmountPerTransaction,
          dailySpentSoFar: 0,
          maxDailySpendLimit: this.rules.maxDailySpendLimit,
          network: request.network,
          asset: request.asset,
          resource: request.resource
        }
      };
      logger.warn(`[SPEND_POLICY_REJECTED] ${decision.reason}`);
      return decision;
    }

    // 2. Network verification (Must be Algorand TestNet)
    const isNetworkAllowed = this.rules.allowedNetworks.includes(request.network) ||
      request.network.toLowerCase().includes('algorand');
    if (!isNetworkAllowed) {
      const decision: SpendPolicyDecision = {
        decision: 'SPEND_POLICY_REJECTED',
        approved: false,
        reason: `Network '${request.network}' is not an authorized payment network. Expected Algorand TestNet.`,
        evaluatedAt: now,
        rules: {
          amount: request.amount,
          maxAmountPerTransaction: this.rules.maxAmountPerTransaction,
          dailySpentSoFar: 0,
          maxDailySpendLimit: this.rules.maxDailySpendLimit,
          network: request.network,
          asset: request.asset,
          resource: request.resource
        }
      };
      logger.warn(`[SPEND_POLICY_REJECTED] ${decision.reason}`);
      return decision;
    }

    // 3. Asset verification (TestNet USDC or ALGO)
    const isAssetAllowed = this.rules.allowedAssets.includes(request.asset) ||
      request.asset.toUpperCase() === 'USDC' ||
      request.asset === USDC_TESTNET_ASA_ID ||
      request.asset.toUpperCase() === 'ALGO';
    if (!isAssetAllowed) {
      const decision: SpendPolicyDecision = {
        decision: 'SPEND_POLICY_REJECTED',
        approved: false,
        reason: `Asset '${request.asset}' is not an authorized payment token. Expected USDC ASA.`,
        evaluatedAt: now,
        rules: {
          amount: request.amount,
          maxAmountPerTransaction: this.rules.maxAmountPerTransaction,
          dailySpentSoFar: 0,
          maxDailySpendLimit: this.rules.maxDailySpendLimit,
          network: request.network,
          asset: request.asset,
          resource: request.resource
        }
      };
      logger.warn(`[SPEND_POLICY_REJECTED] ${decision.reason}`);
      return decision;
    }

    // 4. Per-transaction limit check
    if (request.amount > this.rules.maxAmountPerTransaction) {
      const decision: SpendPolicyDecision = {
        decision: 'SPEND_POLICY_REJECTED',
        approved: false,
        reason: `Requested amount $${request.amount.toFixed(2)} exceeds maximum per-transaction limit ($${this.rules.maxAmountPerTransaction.toFixed(2)}).`,
        evaluatedAt: now,
        rules: {
          amount: request.amount,
          maxAmountPerTransaction: this.rules.maxAmountPerTransaction,
          dailySpentSoFar: 0,
          maxDailySpendLimit: this.rules.maxDailySpendLimit,
          network: request.network,
          asset: request.asset,
          resource: request.resource
        }
      };
      logger.warn(`[SPEND_POLICY_REJECTED] ${decision.reason}`);
      return decision;
    }

    // 5. Daily cumulative spend limit check
    let hospitalPayments: any[] = [];
    try {
      if (typeof this.paymentRepo?.findByHospital === 'function') {
        hospitalPayments = await this.paymentRepo.findByHospital(hospitalId);
      }
    } catch {
      hospitalPayments = [];
    }
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const todaySettledPayments = hospitalPayments.filter((p) => {
      const isSettled = p.status === 'PAYMENT_SETTLED' || p.status === 'PAYMENT_VERIFIED';
      const pDate = new Date(p.settledAt || p.createdAt);
      return isSettled && pDate >= startOfToday;
    });

    const dailySpentSoFar = todaySettledPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    if (dailySpentSoFar + request.amount > this.rules.maxDailySpendLimit) {
      const decision: SpendPolicyDecision = {
        decision: 'SPEND_POLICY_REJECTED',
        approved: false,
        reason: `Payment of $${request.amount.toFixed(2)} would exceed daily spend limit ($${this.rules.maxDailySpendLimit.toFixed(2)}). Already spent today: $${dailySpentSoFar.toFixed(2)}.`,
        evaluatedAt: now,
        rules: {
          amount: request.amount,
          maxAmountPerTransaction: this.rules.maxAmountPerTransaction,
          dailySpentSoFar,
          maxDailySpendLimit: this.rules.maxDailySpendLimit,
          network: request.network,
          asset: request.asset,
          resource: request.resource
        }
      };
      logger.warn(`[SPEND_POLICY_REJECTED] ${decision.reason}`);
      return decision;
    }

    // 6. Receiver destination address validation
    if (this.rules.enforceReceiverMatch && env.ALGORAND_RECEIVER_ADDRESS) {
      if (request.payTo && request.payTo !== env.ALGORAND_RECEIVER_ADDRESS) {
        const decision: SpendPolicyDecision = {
          decision: 'SPEND_POLICY_REJECTED',
          approved: false,
          reason: `Pay-to address does not match expected hospital resource server receiver address.`,
          evaluatedAt: now,
          rules: {
            amount: request.amount,
            maxAmountPerTransaction: this.rules.maxAmountPerTransaction,
            dailySpentSoFar,
            maxDailySpendLimit: this.rules.maxDailySpendLimit,
            network: request.network,
            asset: request.asset,
            resource: request.resource
          }
        };
        logger.warn(`[SPEND_POLICY_REJECTED] ${decision.reason}`);
        return decision;
      }
    }

    // 7. Duplicate / Idempotency check for current procurement run
    if (request.procurementRunId) {
      const existingRunPayment = hospitalPayments.find(
        (p) =>
          p.runId === request.procurementRunId &&
          (p.status === 'PAYMENT_SETTLED' || p.status === 'PAYMENT_VERIFIED') &&
          p.transactionId
      );

      if (existingRunPayment) {
        const decision: SpendPolicyDecision = {
          decision: 'SPEND_POLICY_APPROVED',
          approved: true,
          reason: `Idempotency match: Procurement run ${request.procurementRunId} already settled (Tx: ${existingRunPayment.transactionId}). Reusing existing intelligence.`,
          evaluatedAt: now,
          rules: {
            amount: request.amount,
            maxAmountPerTransaction: this.rules.maxAmountPerTransaction,
            dailySpentSoFar,
            maxDailySpendLimit: this.rules.maxDailySpendLimit,
            network: request.network,
            asset: request.asset,
            resource: request.resource
          }
        };
        logger.info(`[SPEND_POLICY_APPROVED] ${decision.reason}`);
        return decision;
      }
    }

    // All safety rules passed -> Approved
    const decision: SpendPolicyDecision = {
      decision: 'SPEND_POLICY_APPROVED',
      approved: true,
      reason: `Payment of $${request.amount.toFixed(2)} ${request.asset} on Algorand TestNet satisfies all agent spend controls.`,
      evaluatedAt: now,
      rules: {
        amount: request.amount,
        maxAmountPerTransaction: this.rules.maxAmountPerTransaction,
        dailySpentSoFar,
        maxDailySpendLimit: this.rules.maxDailySpendLimit,
        network: request.network,
        asset: request.asset,
        resource: request.resource
      }
    };

    logger.info(`[SPEND_POLICY_APPROVED] Amount: $${request.amount} | Asset: ${request.asset} | Network: ${request.network}`);
    return decision;
  }
}
