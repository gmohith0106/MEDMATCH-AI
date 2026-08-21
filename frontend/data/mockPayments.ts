import { X402PaymentRecord } from '@/types/payment';

/**
 * Payments ledger starts clean with zero simulated payments.
 * Real verified micropayments settled on Algorand TestNet are recorded permanently.
 */
export const mockPayments: X402PaymentRecord[] = [];
