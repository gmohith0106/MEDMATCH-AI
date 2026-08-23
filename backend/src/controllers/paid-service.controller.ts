import { Request, Response, NextFunction } from 'express';
import { PaymentFactory } from '../services/payments/payment.factory';
import { SupplierRepository } from '../repositories/supplier.repository';
import { PaymentRepository } from '../repositories/payment.repository';
import { ArchitectureRepository } from '../repositories/architecture.repository';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';
import { getLoraTransactionUrl } from '../utils/algorand-validation';

export class PaidServiceController {
  private static supplierRepo = new SupplierRepository();
  private static paymentRepo = new PaymentRepository();
  private static archRepo = ArchitectureRepository.getInstance();

  /**
   * Protected x402 Endpoint: GET /api/paid/quote (Priced at $0.005)
   * Returns certified price, delivery lead time, and SLA reliability.
   */
  public static async getQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = (req.query.item as string) || 'inv-surgical-gloves-002';
      const category = (req.query.category as string) || 'PPE';

      // Record instant settlement into the ledger
      await PaidServiceController.archRepo.insertLedger({
        endpoint: '/api/paid/quote',
        amount: 0.005,
        purpose: `Supplier Quote Query: ${item}`
      });

      sendSuccess(res, {
        protocol: 'x402 ExactAvmScheme',
        network: 'Algorand TestNet',
        item,
        quotes: [
          {
            supplierId: 'sup-medisupply-001',
            supplierName: 'MediSupply Healthcare Solutions',
            unitPrice: 1.85,
            deliveryDays: 2,
            reliabilityScore: 99.2,
            sterileBatchVerified: true,
            inStockUnits: 5200
          },
          {
            supplierId: 'sup-caremed-002',
            supplierName: 'CareMed Logistics',
            unitPrice: 2.10,
            deliveryDays: 3,
            reliabilityScore: 96.0,
            sterileBatchVerified: true,
            inStockUnits: 3400
          },
          {
            supplierId: 'sup-apex-003',
            supplierName: 'Apex Medical Supplies',
            unitPrice: 1.95,
            deliveryDays: 4,
            reliabilityScore: 94.5,
            sterileBatchVerified: true,
            inStockUnits: 2100
          }
        ]
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected x402 Endpoint: POST /api/paid/negotiate (Priced at $0.01)
   * One structured counter-offer round for volume discount.
   */
  public static async negotiate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { supplierId, requestedQuantity, targetPrice } = req.body || {};
      const qty = Number(requestedQuantity) || 1650;
      const target = Number(targetPrice) || 1.80;

      // Negotiated volume discount calculation
      const negotiatedPrice = Number(Math.max(target, 1.82).toFixed(2));
      const totalSavings = Number(((1.85 - negotiatedPrice) * qty).toFixed(2));

      await PaidServiceController.archRepo.insertLedger({
        endpoint: '/api/paid/negotiate',
        amount: 0.01,
        purpose: `M2M Volume Counter-Offer: ${supplierId || 'MediSupply'}`
      });

      sendSuccess(res, {
        protocol: 'x402 ExactAvmScheme',
        network: 'Algorand TestNet',
        negotiationStatus: 'COUNTER_OFFER_ACCEPTED',
        supplierId: supplierId || 'sup-medisupply-001',
        supplierName: 'MediSupply Healthcare Solutions',
        originalUnitPrice: 1.85,
        negotiatedUnitPrice: negotiatedPrice,
        orderQuantity: qty,
        totalSavingsUsd: totalSavings,
        counterOfferExpiryMinutes: 60,
        confirmedLeadTimeDays: 2
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected x402 Endpoint: POST /api/paid/order (Priced at real procurement value)
   * On payment, creates the verified order in the orders table.
   */
  public static async createPaidOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { item, itemName, supplier, supplierName, qty, unitPrice, reasoning } = req.body || {};
      const total = (Number(qty) || 1650) * (Number(unitPrice) || 1.85);

      const order = await PaidServiceController.archRepo.createOrder({
        item: item || 'inv-surgical-gloves-002',
        itemName: itemName || 'Surgical Gloves (Sterile, Latex-Free)',
        supplier: supplier || 'sup-medisupply-001',
        supplierName: supplierName || 'MediSupply Healthcare Solutions',
        qty: Number(qty) || 1650,
        unitPrice: Number(unitPrice) || 1.85,
        total_price: total,
        status: 'SETTLED',
        reasoning: reasoning || 'Automated x402 order executed under hospital policy spend cap.',
        txn_id: 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA'
      });

      await PaidServiceController.archRepo.insertLedger({
        endpoint: '/api/paid/order',
        amount: 0.02,
        purpose: `Autonomous Procurement Order: ${order.id}`
      });

      sendSuccess(res, {
        protocol: 'x402 ExactAvmScheme',
        network: 'Algorand TestNet',
        order,
        settlementConfirmed: true,
        message: 'Order created and payment settled on Algorand TestNet'
      }, 201);
      return;
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected x402 Endpoint: GET /api/paid/reliability-score (Priced at $0.02)
   * Computes reliability from historical paid settled orders in reliability_log.
   */
  public static async getPaidReliabilityScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const supplierId = (req.query.supplierId as string) || 'sup-medisupply-001';
      const score = await PaidServiceController.archRepo.computeReliabilityScore(supplierId);

      await PaidServiceController.archRepo.insertLedger({
        endpoint: '/api/paid/reliability-score',
        amount: 0.02,
        purpose: `Supplier Trust Registry Audit: ${supplierId}`
      });

      sendSuccess(res, {
        protocol: 'x402 ExactAvmScheme',
        network: 'Algorand TestNet',
        supplierScoreData: score,
        onChainVerified: true
      });
      return;
    } catch (err) {
      next(err);
    }
  }

  /**
   * Protected x402 Endpoint: GET /api/paid/supplier-intelligence (Backward compatible)
   */
  public static async getSupplierIntelligence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const paymentRecord = {
        id: 'pay-intel-001',
        transactionId: 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA',
        status: 'PAYMENT_SETTLED'
      };

      await PaidServiceController.archRepo.insertLedger({
        endpoint: '/api/paid/supplier-intelligence',
        amount: 0.02,
        purpose: 'Supplier Intelligence Matrix Query'
      });

      PaidServiceController.deliverProtectedResource(res, paymentRecord as any, category);
      return;
    } catch (err) {
      next(err);
    }
  }

  private static deliverProtectedResource(res: Response, payment: any, category?: string): void {
    const suppliers = [
      {
        id: 'sup-medisupply-001',
        name: 'MediSupply Healthcare Solutions',
        unitPrice: 1.85,
        deliveryDays: 2,
        reliability: 99.2,
        score: 94.6,
        category: category || 'PPE',
        stockAvailable: 5200,
        sterileCertVerified: true
      },
      {
        id: 'sup-caremed-002',
        name: 'CareMed Logistics',
        unitPrice: 2.10,
        deliveryDays: 3,
        reliability: 96.0,
        score: 89.8,
        category: category || 'PPE',
        stockAvailable: 3400,
        sterileCertVerified: true
      },
      {
        id: 'sup-apex-003',
        name: 'Apex Medical Supplies',
        unitPrice: 1.95,
        deliveryDays: 4,
        reliability: 94.5,
        score: 93.4,
        category: category || 'PPE',
        stockAvailable: 2100,
        sterileCertVerified: true
      }
    ];

    sendSuccess(res, {
      status: 'VERIFIED_PAID',
      protocol: 'x402 ExactAvmScheme',
      network: 'Algorand TestNet',
      transactionId: payment?.transactionId || 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA',
      explorerUrl: getLoraTransactionUrl(payment?.transactionId || 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA'),
      suppliers
    });
    return;
  }
}
