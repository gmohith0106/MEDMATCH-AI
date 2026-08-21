export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'CRITICAL';

export interface NotificationRecord {
  id: string;
  userId: string;
  hospitalId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}
