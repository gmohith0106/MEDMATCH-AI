import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { updateProfileSchema } from '../schemas/auth.schema';

const router = Router();

// Retrieve current session & linked hospital
router.get('/auth/session', authenticate, AuthController.getSession);
router.get('/me', authenticate, AuthController.getSession);

// Update user profile
router.patch('/auth/profile', authenticate, validateBody(updateProfileSchema), AuthController.updateProfile);

export default router;
