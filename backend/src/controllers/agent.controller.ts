import { Request, Response, NextFunction } from 'express';
import { AgentService } from '../services/agent.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class AgentController {
  private static service = new AgentService();

  public static async runAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || (req.body?.hospitalId as string) || 'hospital-citycare-001';
      const userId = req.auth?.uid || (req.body?.userId as string) || 'user-procurement-mgr';

      const { inventoryItemId, inventoryId } = req.body || {};
      const targetItemId = inventoryItemId || inventoryId;
      const result = await AgentController.service.executeAgentRun(
        hospitalId,
        userId,
        targetItemId
      );

      sendSuccess(res, {
        runId: result.run.id,
        status: result.run.status,
        currentStep: result.run.currentStep,
        startedAt: result.run.startedAt,
        completedAt: result.run.completedAt,
        steps: result.steps,
        events: result.events,
        payment: result.payment,
        recommendation: result.recommendation,
        spendDecision: result.spendDecision
      }, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async getAgentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || (req.query?.hospitalId as string) || 'hospital-citycare-001';
      const runId = Array.isArray(req.params.runId) ? req.params.runId[0] : req.params.runId;
      if (!runId) {
        throw new AppError('Run ID is required', 400, 'VALIDATION_ERROR');
      }

      const result = await AgentController.service.getAgentRunStatus(
        runId,
        hospitalId
      );

      sendSuccess(res, {
        runId: result.run.id,
        status: result.run.status,
        currentStep: result.run.currentStep,
        startedAt: result.run.startedAt,
        completedAt: result.run.completedAt,
        steps: result.steps,
        events: result.events,
        payment: result.payment,
        recommendation: result.recommendation
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAgentEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || (req.query?.hospitalId as string) || 'hospital-citycare-001';
      const runId = Array.isArray(req.params.runId) ? req.params.runId[0] : req.params.runId;
      if (!runId) {
        throw new AppError('Run ID is required', 400, 'VALIDATION_ERROR');
      }

      const events = await AgentController.service.getAgentEvents(
        runId,
        hospitalId
      );
      sendSuccess(res, events);
    } catch (error) {
      next(error);
    }
  }
}
