import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { smsService } from '../services/sms.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/errors';

export class NotificationController {
  private static service = new NotificationService();

  public static async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || 'hospital-citycare-001';
      const userId = req.auth?.uid || 'user-procurement-mgr';

      const notifications = await NotificationController.service.getNotifications(
        userId,
        hospitalId
      );
      sendSuccess(res, notifications);
    } catch (error) {
      next(error);
    }
  }

  public static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.auth?.uid || 'user-procurement-mgr';
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new AppError('Notification ID is required', 400, 'VALIDATION_ERROR');
      }

      const updated = await NotificationController.service.markAsRead(
        id,
        userId
      );
      sendSuccess(res, { success: updated, id });
    } catch (error) {
      next(error);
    }
  }

  public static async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalId = req.hospitalId || 'hospital-citycare-001';
      const userId = req.auth?.uid || 'user-procurement-mgr';

      const count = await NotificationController.service.markAllAsRead(userId, hospitalId);
      sendSuccess(res, { updatedCount: count });
    } catch (error) {
      next(error);
    }
  }

  public static async getSmsStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = smsService.getStatus();
      sendSuccess(res, status);
    } catch (error) {
      next(error);
    }
  }

  public static async sendSms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        throw new AppError('Recipient phone number and message are required', 400, 'VALIDATION_ERROR');
      }
      const result = await smsService.sendNotificationSms(to, message);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

