import { Router } from 'express';
import { PaidServiceController } from '../controllers/paid-service.controller';
import { X402ServerService } from '../services/payments/x402-server.service';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();
const x402Middleware = X402ServerService.getInstance().getMiddleware();

// Layer 5 — Supplier x402 Endpoints
router.get('/paid/quote', optionalAuth, x402Middleware, PaidServiceController.getQuote);
router.post('/paid/negotiate', optionalAuth, x402Middleware, PaidServiceController.negotiate);
router.post('/paid/order', optionalAuth, x402Middleware, PaidServiceController.createPaidOrder);
router.get('/paid/reliability-score', optionalAuth, x402Middleware, PaidServiceController.getPaidReliabilityScore);

// Backward compatible endpoint
router.get('/paid/supplier-intelligence', optionalAuth, x402Middleware, PaidServiceController.getSupplierIntelligence);
router.post('/paid/supplier-intelligence', optionalAuth, x402Middleware, PaidServiceController.getSupplierIntelligence);

export default router;
