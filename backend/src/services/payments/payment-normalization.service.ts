import { PaymentRecord, NormalizedPaymentResponse, PaymentStatus } from '../../types/payment.types';
import { env } from '../../config/env';
import { isAlgorandTxId, getLoraTransactionUrl } from '../../utils/algorand-validation';

export class PaymentNormalizationService {
  /**
   * Normalizes a raw backend PaymentRecord into a clean, consistent response object
   * that the frontend success screen, history table, and detail pages can consume safely.
   */
  public static normalize(payment: PaymentRecord): NormalizedPaymentResponse {
    const txId = payment.transactionId;
    
    // Canonical 5-state normalization:
    // PAYMENT_REQUIRED | PAYMENT_PROCESSING | SETTLEMENT_PENDING | VERIFIED | FAILED
    let canonicalStatus: PaymentStatus = payment.status;
    if (payment.status === 'PAYMENT_SETTLED' || payment.status === 'PAYMENT_VERIFIED' || payment.status === 'VERIFIED') {
      canonicalStatus = 'VERIFIED';
    } else if (payment.status === 'PAYMENT_PROCESSING') {
      canonicalStatus = 'PAYMENT_PROCESSING';
    } else if (payment.status === 'SETTLEMENT_PENDING' || payment.status === 'PAYMENT_SUBMITTED' || payment.status === 'PAYMENT_VERIFYING') {
      canonicalStatus = 'SETTLEMENT_PENDING';
    } else if (payment.status === 'PAYMENT_FAILED' || payment.status === 'FAILED' || payment.status === 'PAYMENT_SIGNER_NOT_CONFIGURED') {
      canonicalStatus = 'FAILED';
    } else if (payment.status === 'PAYMENT_PENDING' || payment.status === 'PAYMENT_REQUIRED') {
      canonicalStatus = payment.transactionId && isAlgorandTxId(payment.transactionId) ? 'SETTLEMENT_PENDING' : 'PAYMENT_REQUIRED';
    }

    const isVerified = canonicalStatus === 'VERIFIED' && isAlgorandTxId(txId);
    const explorerUrl = isVerified && txId ? getLoraTransactionUrl(txId) : undefined;

    const productId = payment.productId || payment.product?.id || 'SURG-GLV-002';
    const productName = payment.productName || payment.product?.name || 'Surgical Gloves (Sterile, Latex-Free)';
    const requiredQuantity = payment.requiredQuantity ?? payment.product?.requiredQuantity ?? 1650;
    const currentStock = payment.currentStock ?? payment.product?.currentStock ?? 1250;
    const forecastDemand = payment.forecastDemand ?? payment.product?.forecastDemand ?? 2900;
    const expectedDeficit = payment.expectedDeficit ?? payment.product?.expectedDeficit ?? 1650;

    const supplierId = payment.supplierId || payment.supplier?.id || 'sup-medisupply-001';
    const supplierName = payment.supplierName || payment.supplier?.name || 'MediSupply Healthcare Solutions';
    const unitPrice = payment.supplierUnitPrice ?? payment.supplier?.unitPrice ?? 1.85;
    const deliveryTime = payment.supplierDeliveryDays ?? payment.supplier?.deliveryDays ?? 2;
    const reliability = payment.supplierReliability ?? payment.supplier?.reliability ?? 99.2;
    const score = payment.supplierScore ?? payment.supplier?.score ?? 94.6;
    const availability = payment.supplier?.availability || '5,000+ units in stock';

    return {
      paymentId: payment.id,
      id: payment.id,
      status: canonicalStatus,
      transactionId: txId,
      amount: payment.amount || 0.02,
      asset: payment.asset || 'USDC',
      network: payment.network || 'Algorand TestNet',
      payerPublicAddress: payment.payerPublicAddress || payment.senderAddress,
      receiverPublicAddress: payment.receiverPublicAddress || payment.receiverAddress,
      product: {
        id: productId,
        name: productName,
        requiredQuantity,
        currentStock,
        forecastDemand,
        expectedDeficit
      },
      supplier: {
        id: supplierId,
        name: supplierName,
        unitPrice,
        deliveryTime,
        reliability,
        score,
        availability
      },
      resource: payment.resource || '/api/paid/supplier-intelligence',
      facilitator: payment.facilitator || env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz',
      explorerUrl,
      settledAt: payment.settledAt,
      createdAt: payment.createdAt
    };
  }

  public static normalizeList(payments: PaymentRecord[]): NormalizedPaymentResponse[] {
    return payments.map((p) => this.normalize(p));
  }
}
