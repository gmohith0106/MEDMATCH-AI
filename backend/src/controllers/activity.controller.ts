import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class ActivityController {
  private static service = new ActivityService();

  public static async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const { page, limit, type, runId } = req.query;
      const result = await ActivityController.service.getActivities(hospitalId, {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
        type: type as string,
        runId: runId as string
      });

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
