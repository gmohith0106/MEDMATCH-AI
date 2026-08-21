import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class SupplierController {
  private static service = new SupplierService();

  public static async getSuppliers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const suppliers = await SupplierController.service.getAllSuppliers();
      sendSuccess(res, suppliers);
    } catch (error) {
      next(error);
    }
  }

  public static async getSupplierById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Supplier ID is required', 400, 'VALIDATION_ERROR');
      }

      const supplier = await SupplierController.service.getSupplierById(id);
      sendSuccess(res, supplier);
    } catch (error) {
      next(error);
    }
  }

  public static async analyzeSupplierForInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const inventoryId = Array.isArray(req.params.inventoryId)
        ? req.params.inventoryId[0]
        : req.params.inventoryId;
      if (!inventoryId) {
        throw new AppError('Inventory ID is required', 400, 'VALIDATION_ERROR');
      }

      const analyses = await SupplierController.service.analyzeSuppliersForInventory(
        hospitalId,
        inventoryId
      );
      sendSuccess(res, analyses);
    } catch (error) {
      next(error);
    }
  }
}
