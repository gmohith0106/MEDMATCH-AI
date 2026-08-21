import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class RecommendationController {
  private static service = new RecommendationService();

  public static async getByRunId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const runId = Array.isArray(req.params.runId)
        ? req.params.runId[0]
        : Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.runId || req.params.id;

      if (!runId) {
        throw new AppError('Run ID is required', 400, 'VALIDATION_ERROR');
      }

      const rec = await RecommendationController.service.getRecommendationByRunId(
        runId
      );

      if (rec.hospitalId !== hospitalId) {
        throw new AppError('Unauthorized access to recommendation', 403, 'FORBIDDEN');
      }

      sendSuccess(res, rec);
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Recommendation ID is required', 400, 'VALIDATION_ERROR');
      }

      const rec = await RecommendationController.service.getRecommendationById(
        id
      );

      if (rec.hospitalId !== hospitalId) {
        throw new AppError('Unauthorized access to recommendation', 403, 'FORBIDDEN');
      }

      sendSuccess(res, rec);
    } catch (error) {
      next(error);
    }
  }

  public static async rejectRecommendation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Recommendation ID is required', 400, 'VALIDATION_ERROR');
      }

      const updated = await RecommendationController.service.rejectRecommendation(
        id,
        hospitalId
      );
      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }
}
