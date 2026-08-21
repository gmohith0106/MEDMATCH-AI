import { Router } from 'express';
import { StaffController } from '../controllers/staff.controller';
import { authenticateStaff, requireRoles } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import {
  createStaffSchema,
  updateStaffSchema,
  updateStaffStatusSchema
} from '../schemas/staff.schema';

const router = Router();

// All staff management routes are ADMIN ONLY
router.get('/', authenticateStaff, requireRoles('ADMIN'), StaffController.listStaff);
router.post('/', authenticateStaff, requireRoles('ADMIN'), validateBody(createStaffSchema), StaffController.createStaff);
router.patch('/:uid/status', authenticateStaff, requireRoles('ADMIN'), validateBody(updateStaffStatusSchema), StaffController.updateStaffStatus);
router.patch('/:uid', authenticateStaff, requireRoles('ADMIN'), validateBody(updateStaffSchema), StaffController.updateStaff);

export default router;
