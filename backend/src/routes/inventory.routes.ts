import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticateStaff, requireRoles } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import {
  createInventorySchema,
  inventoryQuerySchema,
  updateInventorySchema
} from '../schemas/inventory.schema';

const router = Router();

// Inventory Read: ADMIN, INVENTORY_STAFF, MANAGER, PROCUREMENT_STAFF
router.get(
  '/inventory',
  authenticateStaff,
  requireRoles('ADMIN', 'INVENTORY_STAFF', 'MANAGER', 'PROCUREMENT_STAFF'),
  validateQuery(inventoryQuerySchema),
  InventoryController.getInventory
);

router.get(
  '/inventory/:id',
  authenticateStaff,
  requireRoles('ADMIN', 'INVENTORY_STAFF', 'MANAGER', 'PROCUREMENT_STAFF'),
  InventoryController.getInventoryById
);

router.get(
  '/inventory/:id/history',
  authenticateStaff,
  requireRoles('ADMIN', 'INVENTORY_STAFF', 'MANAGER', 'PROCUREMENT_STAFF'),
  InventoryController.getInventoryHistory
);

// Inventory Create/Update: ADMIN, INVENTORY_STAFF
router.post(
  '/inventory',
  authenticateStaff,
  requireRoles('ADMIN', 'INVENTORY_STAFF'),
  validateBody(createInventorySchema),
  InventoryController.createInventory
);

router.patch(
  '/inventory/:id',
  authenticateStaff,
  requireRoles('ADMIN', 'INVENTORY_STAFF'),
  validateBody(updateInventorySchema),
  InventoryController.updateInventory
);

// Inventory Delete: ADMIN only
router.delete(
  '/inventory/:id',
  authenticateStaff,
  requireRoles('ADMIN'),
  InventoryController.deleteInventory
);

export default router;
