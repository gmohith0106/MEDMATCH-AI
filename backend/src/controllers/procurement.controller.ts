import { Request, Response, NextFunction } from 'express';
import { ProcurementService } from '../services/procurement.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class ProcurementController {
  private static service = new ProcurementService();

  public static async getProcurements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const list = await ProcurementController.service.getProcurements(hospitalId);
      sendSuccess(res, list);
    } catch (error) {
      next(error);
    }
  }

  public static async getProcurementById(
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
        throw new AppError('Procurement ID is required', 400, 'VALIDATION_ERROR');
      }

      const item = await ProcurementController.service.getProcurementById(
        hospitalId,
        id
      );
      sendSuccess(res, item);
    } catch (error) {
      next(error);
    }
  }

  public static async createProcurement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      const userId = req.auth?.uid;

      if (!hospitalId || !userId) {
        throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
      }

      const created = await ProcurementController.service.createProcurement(
        hospitalId,
        userId,
        req.body
      );
      sendSuccess(res, created, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async approveProcurement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      const userId = req.auth?.uid;

      if (!hospitalId || !userId) {
        throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Procurement ID is required', 400, 'VALIDATION_ERROR');
      }

      const approved = await ProcurementController.service.approveProcurement(
        hospitalId,
        userId,
        id
      );
      sendSuccess(res, approved);
    } catch (error) {
      next(error);
    }
  }

  public static async cancelProcurement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      const userId = req.auth?.uid;

      if (!hospitalId || !userId) {
        throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Procurement ID is required', 400, 'VALIDATION_ERROR');
      }

      const cancelled = await ProcurementController.service.cancelProcurement(
        hospitalId,
        userId,
        id
      );
      sendSuccess(res, cancelled);
    } catch (error) {
      next(error);
    }
  }
}
