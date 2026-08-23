import { Request, Response, NextFunction } from 'express';
import { ArchitectureRepository } from '../repositories/architecture.repository';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';

export class ArchitectureController {
  private static repo = ArchitectureRepository.getInstance();

  // GET /api/orders
  public static async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await ArchitectureController.repo.getOrders();
      sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  }

  // POST /api/orders
  public static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ArchitectureController.repo.createOrder(req.body);
      sendSuccess(res, order, 201);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/ledger
  public static async getLedger(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ledger = await ArchitectureController.repo.getLedger();
      sendSuccess(res, ledger);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/policy
  public static async getPolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const policy = await ArchitectureController.repo.getPolicy();
      sendSuccess(res, policy);
    } catch (err) {
      next(err);
    }
  }

  // POST /api/policy
  public static async updatePolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await ArchitectureController.repo.updatePolicy(req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/reliability-log
  public static async getReliabilityLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const supplierId = req.query.supplierId as string | undefined;
      const logs = await ArchitectureController.repo.getReliabilityLog(supplierId);
      sendSuccess(res, logs);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/reliability-score/:supplierId
  public static async getReliabilityScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const supplierId = (req.params.supplierId as string) || (req.query.supplierId as string) || 'sup-medisupply-001';
      const score = await ArchitectureController.repo.computeReliabilityScore(supplierId);
      sendSuccess(res, score);
    } catch (err) {
      next(err);
    }
  }
}
