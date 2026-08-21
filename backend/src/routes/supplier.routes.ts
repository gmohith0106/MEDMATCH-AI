import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { authenticateStaff, requireRoles } from '../middleware/auth.middleware';

const router = Router();

// Supplier Read & Analysis: ADMIN, PROCUREMENT_STAFF, MANAGER
router.get(
  '/suppliers',
  authenticateStaff,
  requireRoles('ADMIN', 'PROCUREMENT_STAFF', 'MANAGER'),
  SupplierController.getSuppliers
);

router.get(
  '/suppliers/:id',
  authenticateStaff,
  requireRoles('ADMIN', 'PROCUREMENT_STAFF', 'MANAGER'),
  SupplierController.getSupplierById
);

router.get(
  '/suppliers/analyze/:inventoryId',
  authenticateStaff,
  requireRoles('ADMIN', 'PROCUREMENT_STAFF', 'MANAGER'),
  SupplierController.analyzeSupplierForInventory
);

export default router;
