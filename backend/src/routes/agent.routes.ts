import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { runAgentSchema } from '../schemas/agent.schema';

const router = Router();

router.post(
  '/agent/run',
  optionalAuth,
  validateBody(runAgentSchema),
  AgentController.runAgent
);

router.get('/agent/:runId', optionalAuth, AgentController.getAgentStatus);
router.get('/agent/:runId/events', optionalAuth, AgentController.getAgentEvents);

export default router;
