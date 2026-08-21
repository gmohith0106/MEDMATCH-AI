import { Router } from 'express';
import { HospitalController } from '../controllers/hospital.controller';
import { optionalAuth, authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { updateHospitalSchema } from '../schemas/hospital.schema';

const router = Router();

// Authoritative Hospital Directory Endpoints (30,273 records)
router.get('/hospitals', optionalAuth, HospitalController.listHospitals);
router.get('/hospitals/filters', optionalAuth, HospitalController.getFilters);
router.get('/hospitals/:id', optionalAuth, HospitalController.getHospitalById);

// Institutional Hospital Profile Endpoints
router.get('/hospital', optionalAuth, HospitalController.getHospital);
router.patch('/hospital', optionalAuth, validateBody(updateHospitalSchema), HospitalController.updateHospital);

export default router;
