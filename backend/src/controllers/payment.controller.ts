import { Request, Response, NextFunction } from 'express';
import { PaymentFactory } from '../services/payments/payment.factory';
import { PaymentNormalizationService } from '../services/payments/payment-normalization.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { X402BuyerClientService } from '../services/payments/buyer-client.service';
import { AlgorandServiceImpl } from '../services/algorand/algorand.service';
import { isAlgorandTxId } from '../utils/algorand-validation';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class PaymentController {
  private static paymentRepo = new PaymentRepository();

  private static getService() {
    return PaymentFactory.getService();
  }

  public static async getConfigStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = PaymentController.getService();
      const status = await service.getConfigStatus();
      sendSuccess(res, status);
    } catch (error) {
      next(error);
    }
  }

  public static async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || (req.query?.hospitalId as string) || 'hospital-citycare-001';
      const service = PaymentController.getService();
      const rawPayments = await service.getPaymentsByHospital(hospitalId);
      const normalized = PaymentNormalizationService.normalizeList(rawPayments);
      sendSuccess(res, normalized);
    } catch (error) {
      next(error);
    }
  }

  public static async getLatestPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || (req.query?.hospitalId as string) || 'hospital-citycare-001';
      const payment = await PaymentController.paymentRepo.findLatest(hospitalId);
      if (!payment) {
        sendSuccess(res, null);
        return;
      }
      const normalized = PaymentNormalizationService.normalize(payment);
      sendSuccess(res, normalized);
    } catch (error) {
      next(error);
    }
  }

  public static async getPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || (req.query?.hospitalId as string) || 'hospital-citycare-001';
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Payment ID is required', 400, 'VALIDATION_ERROR');
      }

      const service = PaymentController.getService();
      let payment = await service.getPaymentById(id);
      
      // Fallback search by transactionId if id not matched
      if (!payment) {
        payment = await PaymentController.paymentRepo.findByTransactionId(id);
      }

      if (!payment || (payment.hospitalId && payment.hospitalId !== hospitalId && payment.hospitalId !== 'hospital-citycare-001')) {
        throw new AppError(`Payment record ${id} not found`, 404, 'RESOURCE_NOT_FOUND');
      }

      const normalized = PaymentNormalizationService.normalize(payment);
      sendSuccess(res, normalized);
    } catch (error) {
      next(error);
    }
  }

  public static async createPaymentRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || req.body.hospitalId || 'hospital-citycare-001';
      const userId = (req as any).auth?.uid || req.body.userId || 'user-procurement-mgr';
      const service = PaymentController.getService();

      const result = await service.createPaymentRequirement({
        hospitalId,
        userId,
        runId: req.body.runId,
        agentRunId: req.body.agentRunId || req.body.runId,
        amount: 0.02,
        asset: 'USDC',
        currency: 'USD',
        purpose: req.body.purpose || 'Autonomous Agent Tier-1 Supplier Intelligence Oracle Fee',
        resource: req.body.resource || '/api/paid/supplier-intelligence',
        metadata: req.body.metadata
      });

      sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async submitPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { paymentId, transactionId, senderAddress, receiverAddress } = req.body;
      if (!paymentId) {
        throw new AppError('paymentId is required', 400, 'VALIDATION_ERROR');
      }

      const service = PaymentController.getService();
      const updated = await service.submitPayment({
        paymentId,
        transactionId,
        senderAddress,
        receiverAddress
      });

      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }

  public static async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { paymentId, transactionId, txId } = req.body;
      const targetPaymentId = paymentId || (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
      if (!targetPaymentId) {
        throw new AppError('paymentId is required for verification', 400, 'VALIDATION_ERROR');
      }

      const service = PaymentController.getService();
      const result = await service.verifyPayment(targetPaymentId, transactionId || txId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/payments/:id/pay
   * Executes payment for an unpaid / pending payment record.
   * Prevents duplicate payments if status is already SETTLEMENT_PENDING or VERIFIED.
   */
  public static async payPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || req.body.paymentId);
      if (!id) {
        throw new AppError('Payment ID is required', 400, 'VALIDATION_ERROR');
      }

      let payment = await PaymentController.paymentRepo.findById(id);
      if (!payment) {
        payment = await PaymentController.paymentRepo.findByTransactionId(id);
      }
      if (!payment) {
        throw new AppError(`Payment record ${id} not found`, 404, 'RESOURCE_NOT_FOUND');
      }

      // Duplicate payment protection:
      // If already settled, pending on-chain, or processing, do NOT initiate second payment!
      if (payment.status === 'VERIFIED' || payment.status === 'PAYMENT_SETTLED' || payment.status === 'PAYMENT_VERIFIED') {
        const normalized = PaymentNormalizationService.normalize(payment);
        sendSuccess(res, normalized);
        return;
      }
      if (payment.status === 'SETTLEMENT_PENDING') {
        const normalized = PaymentNormalizationService.normalize(payment);
        sendSuccess(res, normalized);
        return;
      }

      const now = new Date().toISOString();
      await PaymentController.paymentRepo.update(payment.id, {
        status: 'PAYMENT_PROCESSING',
        updatedAt: now
      });

      // Execute on-chain payment via server-side signer and x402 Buyer Client
      const buyerClient = X402BuyerClientService.getInstance();
      const result = await buyerClient.purchaseSupplierIntelligence({
        hospitalId: payment.hospitalId || 'hospital-citycare-001',
        userId: payment.userId || 'user-procurement-mgr',
        procurementRunId: payment.procurementRunId || payment.runId || payment.id,
        product: payment.product,
        supplier: payment.supplier
      });

      if (result.success && result.transactionId && isAlgorandTxId(result.transactionId)) {
        const updated = await PaymentController.paymentRepo.update(payment.id, {
          status: 'VERIFIED',
          transactionId: result.transactionId,
          verified: true,
          settledAt: result.settledAt || now,
          verifiedAt: now,
          payerPublicAddress: result.payerAddress,
          receiverPublicAddress: result.receiverAddress,
          updatedAt: now
        });
        const normalized = PaymentNormalizationService.normalize(updated || payment);
        sendSuccess(res, normalized);
        return;
      } else if (result.statusCode === 402 || result.error === 'PAYMENT_SIGNER_NOT_CONFIGURED') {
        const updated = await PaymentController.paymentRepo.update(payment.id, {
          status: 'PAYMENT_REQUIRED',
          errorMessage: result.message,
          updatedAt: now
        });
        const normalized = PaymentNormalizationService.normalize(updated || payment);
        sendSuccess(res, normalized);
        return;
      } else {
        const updated = await PaymentController.paymentRepo.update(payment.id, {
          status: 'FAILED',
          errorMessage: result.message || result.error,
          updatedAt: now
        });
        const normalized = PaymentNormalizationService.normalize(updated || payment);
        sendSuccess(res, normalized);
        return;
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/payments/:id/check
   * Queries existing on-chain transaction for SETTLEMENT_PENDING records.
   * Updates state to VERIFIED if confirmed on Algorand TestNet without making a second payment.
   */
  public static async checkPaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id || req.body.paymentId);
      if (!id) {
        throw new AppError('Payment ID is required', 400, 'VALIDATION_ERROR');
      }

      let payment = await PaymentController.paymentRepo.findById(id);
      if (!payment) {
        payment = await PaymentController.paymentRepo.findByTransactionId(id);
      }
      if (!payment) {
        throw new AppError(`Payment record ${id} not found`, 404, 'RESOURCE_NOT_FOUND');
      }

      const now = new Date().toISOString();

      if (payment.status === 'VERIFIED' || payment.status === 'PAYMENT_SETTLED' || payment.status === 'PAYMENT_VERIFIED') {
        const normalized = PaymentNormalizationService.normalize(payment);
        sendSuccess(res, normalized);
        return;
      }

      if (payment.transactionId && isAlgorandTxId(payment.transactionId)) {
        const algorandService = new AlgorandServiceImpl();
        const tx = await algorandService.getTransaction(payment.transactionId);

        if (tx && tx.status === 'CONFIRMED' && (tx.confirmedRound || 0) > 0) {
          const updated = await PaymentController.paymentRepo.update(payment.id, {
            status: 'VERIFIED',
            verified: true,
            confirmedRound: tx.confirmedRound,
            blockNumber: tx.confirmedRound,
            settledAt: tx.timestamp || now,
            verifiedAt: now,
            updatedAt: now
          });
          const normalized = PaymentNormalizationService.normalize(updated || payment);
          sendSuccess(res, normalized);
          return;
        } else if (tx && tx.status === 'PENDING') {
          const updated = await PaymentController.paymentRepo.update(payment.id, {
            status: 'SETTLEMENT_PENDING',
            updatedAt: now
          });
          const normalized = PaymentNormalizationService.normalize(updated || payment);
          sendSuccess(res, normalized);
          return;
        }
      }

      const normalized = PaymentNormalizationService.normalize(payment);
      sendSuccess(res, normalized);
    } catch (error) {
      next(error);
    }
  }
}
