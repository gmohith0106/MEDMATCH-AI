import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Retrieve by runId or recommendationId
router.get('/recommendation/:id', authenticate, async (req, res, next) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (id && id.startsWith('run-')) {
    return RecommendationController.getByRunId(req, res, next);
  }
  return RecommendationController.getById(req, res, next);
});

router.post('/recommendation/:id/reject', authenticate, RecommendationController.rejectRecommendation);

export default router;
