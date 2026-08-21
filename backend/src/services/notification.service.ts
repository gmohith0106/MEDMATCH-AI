import { v4 as uuidv4 } from 'uuid';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationRecord, NotificationType } from '../types/notification.types';
import { getCurrentIsoDate } from '../utils/dates';

export class NotificationService {
  private repo = new NotificationRepository();

  async getNotifications(userId: string, hospitalId: string): Promise<NotificationRecord[]> {
    return this.repo.findByUser(userId, hospitalId);
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    return this.repo.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string, hospitalId: string): Promise<number> {
    return this.repo.markAllAsRead(userId, hospitalId);
  }

  async createNotification(
    userId: string,
    hospitalId: string,
    title: string,
    message: string,
    type: NotificationType = 'INFO',
    metadata?: Record<string, unknown>
  ): Promise<NotificationRecord> {
    const notification: NotificationRecord = {
      id: `notif-${uuidv4().substring(0, 8)}`,
      userId,
      hospitalId,
      title,
      message,
      type,
      read: false,
      createdAt: getCurrentIsoDate(),
      metadata
    };
    return this.repo.create(notification);
  }
}
