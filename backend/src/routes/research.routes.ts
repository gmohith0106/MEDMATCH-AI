import { Router } from 'express';
import { askResearch } from '../controllers/research.controller';

const router = Router();
router.post('/ask', askResearch);

export default router;