import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateStaff, requireRoles, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Payment config & diagnostics: ADMIN or Authenticated Staff
router.get('/payments/config-status', optionalAuth, PaymentController.getConfigStatus);

// Payments history: ADMIN, PROCUREMENT_STAFF, MANAGER
router.get('/payments', optionalAuth, PaymentController.getPayments);
router.get('/payments/latest', optionalAuth, PaymentController.getLatestPayment);
router.get('/payments/:id', optionalAuth, PaymentController.getPaymentById);

// Payment request creation
router.post('/payments/request', optionalAuth, PaymentController.createPaymentRequest);
router.post('/payments/submit', optionalAuth, PaymentController.submitPayment);
router.post('/payments/verify', optionalAuth, PaymentController.verifyPayment);
router.post('/payments/:id/verify', optionalAuth, PaymentController.verifyPayment);

// Pending payment execution (Pay 0.001 USDC): ADMIN, PROCUREMENT_STAFF only
router.post('/payments/:id/pay', optionalAuth, PaymentController.payPayment);
router.post('/payments/pay', optionalAuth, PaymentController.payPayment);

// Check status (Settlement Pending): ADMIN, PROCUREMENT_STAFF, MANAGER
router.post('/payments/:id/check', optionalAuth, PaymentController.checkPaymentStatus);
router.post('/payments/check', optionalAuth, PaymentController.checkPaymentStatus);

export default router;
