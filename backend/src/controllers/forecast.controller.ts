import { Request, Response, NextFunction } from 'express';
import { ForecastService } from '../services/forecast.service';
import { ShortageService } from '../services/shortage.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class ForecastController {
  private static forecastService = new ForecastService();
  private static shortageService = new ShortageService();

  public static async getForecast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const days = typeof req.query.days === 'number' ? req.query.days : 7;
      const forecasts = await ForecastController.forecastService.getHospitalForecasts(
        hospitalId,
        days
      );
      sendSuccess(res, forecasts);
    } catch (error) {
      next(error);
    }
  }

  public static async getForecastByInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const days = typeof req.query.days === 'number' ? req.query.days : 7;
      const inventoryId = Array.isArray(req.params.inventoryId)
        ? req.params.inventoryId[0]
        : req.params.inventoryId;
      if (!inventoryId) {
        throw new AppError('Inventory ID is required', 400, 'VALIDATION_ERROR');
      }

      const forecast = await ForecastController.forecastService.getForecastForInventory(
        hospitalId,
        inventoryId,
        days
      );
      sendSuccess(res, forecast);
    } catch (error) {
      next(error);
    }
  }

  public static async getShortages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId;
      if (!hospitalId) {
        throw new AppError('Hospital context missing', 400, 'HOSPITAL_NOT_FOUND');
      }

      const shortages = await ForecastController.shortageService.detectShortagesForHospital(
        hospitalId,
        7
      );
      sendSuccess(res, shortages);
    } catch (error) {
      next(error);
    }
  }
}
