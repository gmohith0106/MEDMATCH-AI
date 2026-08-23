import { Request, Response, NextFunction } from 'express';
import { PaymentFactory } from '../services/payments/payment.factory';
import { SupplierRepository } from '../repositories/supplier.repository';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';

export class PaidServiceController {
  private static supplierRepo = new SupplierRepository();

  /**
   * Protected x402 Endpoint: GET /api/paid/supplier-intelligence
   * 
   * Flow:
   * 1. Inspects request for PAYMENT-SIGNATURE, X-PAYMENT, or Authorization header / query paymentId.
   * 2. If missing or unverified, responds with HTTP 402 Payment Required + PAYMENT-REQUIRED header.
   * 3. If valid payment proof or verified paymentId is supplied, returns HTTP 200 + PAYMENT-RESPONSE header + protected intelligence.
   */
  public static async getSupplierIntelligence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentService = PaymentFactory.getService();
      const hospitalId = (req as any).hospitalId || (req.query.hospitalId as string) || 'hospital-citycare-001';
      const userId = (req as any).userId || (req.query.userId as string) || 'user-procurement-mgr';
      const runId = (req.query.runId as string) || (req.query.agentRunId as string);
      const category = req.query.category as string | undefined;

      // Extract payment signature / token from headers or query
      const paymentSigHeader = req.header('PAYMENT-SIGNATURE') || req.header('X-PAYMENT');
      const paymentIdQuery = req.query.paymentId as string | undefined;
      const txIdQuery = (req.query.txId as string) || (req.query.transactionId as string) || undefined;

      let targetPaymentId = paymentIdQuery;
      let targetTxId = txIdQuery;

      if (paymentSigHeader) {
        try {
          const clean = paymentSigHeader.replace(/^(x402|Bearer)\s+/i, '').trim();
          // Check if it's base64 JSON
          const decoded = Buffer.from(clean, 'base64').toString('utf8');
          if (decoded.startsWith('{')) {
            const parsed = JSON.parse(decoded);
            targetPaymentId = parsed.paymentId || targetPaymentId;
            targetTxId = parsed.transactionId || parsed.txId || targetTxId;
          } else {
            targetTxId = clean;
          }
        } catch {
          targetTxId = paymentSigHeader;
        }
      }

      // If we have a payment ID to verify
      if (targetPaymentId) {
        const existingPayment = await paymentService.getPaymentById(targetPaymentId);
        
        if (existingPayment && (existingPayment.status === 'PAYMENT_VERIFIED' || existingPayment.status === 'PAYMENT_SETTLED')) {
          // Already verified! Deliver protected data
          return PaidServiceController.deliverProtectedResource(res, existingPayment, category);
        }

        // If transaction ID is available, attempt verification
        if (targetTxId || existingPayment?.transactionId) {
          try {
            const verifyResult = await paymentService.verifyPayment(targetPaymentId, targetTxId);
            if (verifyResult.verified) {
              const updatedPayment = await paymentService.getPaymentById(targetPaymentId);
              return PaidServiceController.deliverProtectedResource(res, updatedPayment || existingPayment!, category);
            }
          } catch (err: any) {
            logger.warn(`[PaidServiceController] Payment verification failed for ${targetPaymentId}`, err);
          }
        }
      }

      // No verified payment proof -> Generate and return HTTP 402
      const requirementResult = await paymentService.createPaymentRequirement({
        runId,
        agentRunId: runId,
        hospitalId,
        userId,
        amount: 0.001,
        asset: 'ALGO',
        currency: 'USD',
        resource: '/api/paid/supplier-intelligence',
        purpose: 'Real-time Tier-1 Supplier SLA & Inventory Availability Oracle'
      });

      // Set official x402 headers
      res.setHeader('PAYMENT-REQUIRED', requirementResult.headerPayloadBase64);
      res.setHeader('Access-Control-Expose-Headers', 'PAYMENT-REQUIRED, PAYMENT-RESPONSE');

      res.status(402).json({
        success: false,
        status: 'PAYMENT_REQUIRED',
        statusCode: 402,
        message: 'Payment required to access protected supplier intelligence oracle',
        paymentId: requirementResult.paymentId,
        paymentRequirement: requirementResult.paymentRequirement,
        headerPayloadBase64: requirementResult.headerPayloadBase64
      });
    } catch (error) {
      next(error);
    }
  }

  private static async deliverProtectedResource(
    res: Response,
    paymentRecord: any,
    category?: string
  ): Promise<void> {
    let suppliers = category
      ? await PaidServiceController.supplierRepo.findByCategory(category)
      : await PaidServiceController.supplierRepo.findAll();

    if (suppliers.length === 0) {
      suppliers = await PaidServiceController.supplierRepo.findAll();
    }

    const receipt = {
      paymentId: paymentRecord.id,
      transactionId: paymentRecord.transactionId,
      senderAddress: paymentRecord.senderAddress,
      receiverAddress: paymentRecord.receiverAddress,
      network: paymentRecord.network,
      amount: paymentRecord.amount,
      asset: paymentRecord.asset,
      status: paymentRecord.status,
      settledAt: paymentRecord.settledAt || paymentRecord.verifiedAt,
      explorerUrl: paymentRecord.explorerUrl
    };

    const receiptBase64 = Buffer.from(JSON.stringify(receipt), 'utf8').toString('base64');
    res.setHeader('PAYMENT-RESPONSE', receiptBase64);
    res.setHeader('Access-Control-Expose-Headers', 'PAYMENT-REQUIRED, PAYMENT-RESPONSE');

    sendSuccess(res, {
      paymentReceipt: receipt,
      intelligenceType: 'Tier-1 Certified Supplier Network SLA & Capacity Matrix',
      source: 'MedMatch Logistics Oracle & Public Healthcare Dataset Registry',
      retrievedAt: new Date().toISOString(),
      suppliersCount: suppliers.length,
      suppliers
    });
  }
}
