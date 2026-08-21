import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class InventoryController {
  private static service = new InventoryService();

  public static async getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const result = await InventoryController.service.getInventory(hospitalId, req.query as any);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  public static async getInventoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Inventory ID is required', 400, 'VALIDATION_ERROR');
      }

      const item = await InventoryController.service.getInventoryById(hospitalId, id);
      sendSuccess(res, item);
    } catch (error) {
      next(error);
    }
  }

  public static async createInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const created = await InventoryController.service.createInventory(hospitalId, req.body);
      sendSuccess(res, created, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async updateInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Inventory ID is required', 400, 'VALIDATION_ERROR');
      }

      const updated = await InventoryController.service.updateInventory(
        hospitalId,
        id,
        req.body
      );
      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Inventory ID is required', 400, 'VALIDATION_ERROR');
      }

      await InventoryController.service.deleteInventory(hospitalId, id);
      sendSuccess(res, { message: `Inventory item ${id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }

  public static async getInventoryHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Inventory ID is required', 400, 'VALIDATION_ERROR');
      }

      const history = await InventoryController.service.getInventoryHistory(
        hospitalId,
        id
      );
      sendSuccess(res, history);
    } catch (error) {
      next(error);
    }
  }
}
