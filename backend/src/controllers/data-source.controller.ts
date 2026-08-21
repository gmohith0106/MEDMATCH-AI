import { Request, Response, NextFunction } from 'express';
import { DataSourceService } from '../services/data-source.service';
import { AppError } from '../utils/errors';

export class DataSourceController {
  private dataSourceService = new DataSourceService();

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.dataSourceService.getAllDataSources();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Data source ID is required', 400, 'VALIDATION_ERROR');
      }
      const data = await this.dataSourceService.getDataSourceById(id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  public sync = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Data source ID is required', 400, 'VALIDATION_ERROR');
      }
      const data = await this.dataSourceService.syncDataSource(id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
