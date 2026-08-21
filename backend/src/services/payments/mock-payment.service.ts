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
import { X402PaymentService } from './x402-payment.service';

/**
 * MockPaymentService delegates cleanly to X402PaymentService to ensure
 * single-standard Algorand x402 compliance across all environments.
 */
export class MockPaymentService implements PaymentService {
  public readonly mode = 'x402' as const;
  private delegate = new X402PaymentService();

  generate402Header(requirement: X402PaymentRequirement): string {
    return this.delegate.generate402Header(requirement);
  }

  parse402Header(headerValue: string): X402PaymentRequirement | null {
    return this.delegate.parse402Header(headerValue);
  }

  getConfigStatus(): Promise<PaymentConfigStatus> {
    return this.delegate.getConfigStatus();
  }

  createPaymentRequirement(params: CreatePaymentRequestParams): Promise<PaymentRequestResult> {
    return this.delegate.createPaymentRequirement(params);
  }

  submitPayment(params: SubmitPaymentParams): Promise<PaymentRecord> {
    return this.delegate.submitPayment(params);
  }

  verifyPayment(paymentId: string, txId?: string): Promise<PaymentVerificationResult> {
    return this.delegate.verifyPayment(paymentId, txId);
  }

  getPaymentById(paymentId: string): Promise<PaymentRecord | null> {
    return this.delegate.getPaymentById(paymentId);
  }

  getPaymentsByHospital(hospitalId: string): Promise<PaymentRecord[]> {
    return this.delegate.getPaymentsByHospital(hospitalId);
  }
}
