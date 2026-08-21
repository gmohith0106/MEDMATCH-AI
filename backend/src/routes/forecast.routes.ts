import { Router } from 'express';
import { ForecastController } from '../controllers/forecast.controller';
import { authenticateStaff, requireRoles } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation.middleware';
import { forecastQuerySchema } from '../schemas/agent.schema';

const router = Router();

// Forecast Read: ADMIN, INVENTORY_STAFF, MANAGER
router.get(
  '/forecast',
  authenticateStaff,
  requireRoles('ADMIN', 'INVENTORY_STAFF', 'MANAGER'),
  validateQuery(forecastQuerySchema),
  ForecastController.getForecast
);

router.get(
  '/forecast/:inventoryId',
  authenticateStaff,
  requireRoles('ADMIN', 'INVENTORY_STAFF', 'MANAGER'),
  validateQuery(forecastQuerySchema),
  ForecastController.getForecastByInventory
);

router.get(
  '/shortages',
  authenticateStaff,
  requireRoles('ADMIN', 'INVENTORY_STAFF', 'MANAGER'),
  ForecastController.getShortages
);

export default router;
