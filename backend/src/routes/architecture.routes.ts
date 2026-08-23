import { Router } from 'express';
import { ArchitectureController } from '../controllers/architecture.controller';
import { authenticateStaff } from '../middleware/auth.middleware';

const router = Router();

// Orders
router.get('/orders', authenticateStaff, ArchitectureController.getOrders);
router.post('/orders', authenticateStaff, ArchitectureController.createOrder);

// Ledger
router.get('/ledger', authenticateStaff, ArchitectureController.getLedger);

// Policy
router.get('/policy', authenticateStaff, ArchitectureController.getPolicy);
router.post('/policy', authenticateStaff, ArchitectureController.updatePolicy);

// Reliability Data Product
router.get('/reliability-log', authenticateStaff, ArchitectureController.getReliabilityLog);
router.get('/reliability-score/:supplierId', authenticateStaff, ArchitectureController.getReliabilityScore);
router.get('/reliability-score', authenticateStaff, ArchitectureController.getReliabilityScore);

export default router;
