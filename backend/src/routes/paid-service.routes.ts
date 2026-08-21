import { Router } from 'express';
import { PaidServiceController } from '../controllers/paid-service.controller';
import { X402ServerService } from '../services/payments/x402-server.service';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();
const x402Middleware = X402ServerService.getInstance().getMiddleware();

// Protected x402 endpoint for supplier intelligence
router.get('/paid/supplier-intelligence', optionalAuth, x402Middleware, PaidServiceController.getSupplierIntelligence);
router.post('/paid/supplier-intelligence', optionalAuth, x402Middleware, PaidServiceController.getSupplierIntelligence);

export default router;
