import { Request, Response, NextFunction } from 'express';
import { HospitalService } from '../services/hospital.service';
import { hospitalDirectoryService } from '../services/hospital-directory.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class HospitalController {
  private static service = new HospitalService();

  /**
   * Search and filter the authoritative hospital directory (30,273 records)
   * GET /api/hospitals
   */
  public static async listHospitals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string | undefined;
      const state = req.query.state as string | undefined;
      const district = req.query.district as string | undefined;
      const town = req.query.town as string | undefined;
      const careType = (req.query.careType || req.query.hospitalCareType) as string | undefined;
      const category = (req.query.category || req.query.hospitalCategory) as string | undefined;
      const discipline = req.query.discipline as string | undefined;
      const emergencyServices = req.query.emergencyServices as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';

      const results = hospitalDirectoryService.queryHospitals({
        search,
        state,
        district,
        town,
        careType,
        category,
        discipline,
        emergencyServices,
        page,
        limit,
        sortBy,
        sortOrder
      });

      sendSuccess(res, results);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unique filters for dropdown menus (states, careTypes, categories, disciplines)
   * GET /api/hospitals/filters
   */
  public static async getFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = hospitalDirectoryService.getFilters();
      sendSuccess(res, filters);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get authoritative hospital record by ID (Sr_No or hosp-ID)
   * GET /api/hospitals/:id
   */
  public static async getHospitalById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!id) {
        throw new AppError('Hospital ID parameter is required', 400, 'VALIDATION_ERROR');
      }

      const hospital = hospitalDirectoryService.getHospitalById(id);
      if (!hospital) {
        throw new AppError(`Hospital record '${id}' not found in authoritative directory`, 404, 'HOSPITAL_NOT_FOUND');
      }

      sendSuccess(res, hospital);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Authenticated user institutional profile
   * GET /api/hospital
   */
  public static async getHospital(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || 'hospital-citycare-001';
      const hospital = await HospitalController.service.getHospital(hospitalId);
      sendSuccess(res, hospital);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update institutional profile
   * PATCH /api/hospital
   */
  public static async updateHospital(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || 'hospital-citycare-001';
      const updated = await HospitalController.service.updateHospital(hospitalId, req.body);
      sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }
}
