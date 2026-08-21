import {
  PaymentConfigStatus,
  PaymentRecord,
  PaymentRequestResult,
  PaymentVerificationResult,
  X402PaymentRequirement
} from '../../types/payment.types';

export interface CreatePaymentRequestParams {
  runId?: string;
  agentRunId?: string;
  hospitalId: string;
  userId: string;
  amount?: number;
  asset?: 'ALGO' | 'USDC';
  currency?: string;
  resource?: string;
  purpose?: string;
  metadata?: Record<string, unknown>;
}

export interface SubmitPaymentParams {
  paymentId: string;
  transactionId?: string;
  senderAddress?: string;
  receiverAddress?: string;
  signedTransaction?: string;
}

export interface PaymentService {
  readonly mode: 'x402';
  createPaymentRequirement(params: CreatePaymentRequestParams): Promise<PaymentRequestResult>;
  submitPayment(params: SubmitPaymentParams): Promise<PaymentRecord>;
  verifyPayment(paymentId: string, txId?: string): Promise<PaymentVerificationResult>;
  getPaymentById(paymentId: string): Promise<PaymentRecord | null>;
  getPaymentsByHospital(hospitalId: string): Promise<PaymentRecord[]>;
  getConfigStatus(): Promise<PaymentConfigStatus>;
  generate402Header(requirement: X402PaymentRequirement): string;
  parse402Header(headerValue: string): X402PaymentRequirement | null;
}

