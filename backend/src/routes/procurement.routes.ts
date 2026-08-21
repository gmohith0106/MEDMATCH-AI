import { Router } from 'express';
import { ProcurementController } from '../controllers/procurement.controller';
import { authenticateStaff, requireRoles } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createProcurementSchema } from '../schemas/procurement.schema';

const router = Router();

// Procurement Read: ADMIN, PROCUREMENT_STAFF, MANAGER
router.get(
  '/procurement',
  authenticateStaff,
  requireRoles('ADMIN', 'PROCUREMENT_STAFF', 'MANAGER'),
  ProcurementController.getProcurements
);

router.get(
  '/procurement/:id',
  authenticateStaff,
  requireRoles('ADMIN', 'PROCUREMENT_STAFF', 'MANAGER'),
  ProcurementController.getProcurementById
);

// Procurement Create: ADMIN, PROCUREMENT_STAFF
router.post(
  '/procurement',
  authenticateStaff,
  requireRoles('ADMIN', 'PROCUREMENT_STAFF'),
  validateBody(createProcurementSchema),
  ProcurementController.createProcurement
);

// Procurement Human Approval: ADMIN, MANAGER
router.post(
  '/procurement/:id/approve',
  authenticateStaff,
  requireRoles('ADMIN', 'MANAGER'),
  ProcurementController.approveProcurement
);

router.post(
  '/procurement/:id/cancel',
  authenticateStaff,
  requireRoles('ADMIN', 'PROCUREMENT_STAFF', 'MANAGER'),
  ProcurementController.cancelProcurement
);

export default router;
