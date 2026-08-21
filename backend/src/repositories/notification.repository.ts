import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { NotificationRecord } from '../types/notification.types';
import { MemoryStore } from './memory-store';
import { logger } from '../utils/logger';

export class NotificationRepository {
  private ref = rtdb.ref('notifications');
  private memStore = MemoryStore.getInstance();

  async create(notification: NotificationRecord): Promise<NotificationRecord> {
    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(notification.id).set(notification);
      } catch (err) {
        logger.warn(`[NotificationRepository] RTDB write error for ${notification.id}`, err);
      }
    }
    this.memStore.notifications.set(notification.id, notification);
    return notification;
  }

  async findByUser(userId: string, hospitalId: string, limit = 50): Promise<NotificationRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: NotificationRecord[] = Object.values(val);
          const filtered = list.filter(
            (n) => n.hospitalId === hospitalId || n.hospitalId === 'hospital-citycare-001' || n.userId === userId
          );
          filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          return filtered.slice(0, limit);
        }
      } catch (err) {
        logger.warn('[NotificationRepository] RTDB read error', err);
      }
    }

    const items = Array.from(this.memStore.notifications.values()).filter(
      (n) => n.hospitalId === hospitalId || n.hospitalId === 'hospital-citycare-001' || n.userId === userId
    );
    items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return items.slice(0, limit);
  }

  async markAsRead(id: string, _userId?: string): Promise<boolean> {
    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(id).update({ read: true });
      } catch (err) {
        logger.warn(`[NotificationRepository] RTDB markAsRead error for ${id}`, err);
      }
    }
    const notif = this.memStore.notifications.get(id);
    if (notif) {
      notif.read = true;
      this.memStore.notifications.set(id, notif);
      return true;
    }
    return true;
  }

  async markAllAsRead(_userId: string, hospitalId: string): Promise<number> {
    let count = 0;
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const updates: Record<string, any> = {};
          Object.keys(val).forEach((key) => {
            const item = val[key];
            if ((item.hospitalId === hospitalId || item.hospitalId === 'hospital-citycare-001') && !item.read) {
              updates[`${key}/read`] = true;
              count++;
            }
          });
          if (Object.keys(updates).length > 0) {
            await this.ref.update(updates);
          }
        }
      } catch (err) {
        logger.warn('[NotificationRepository] RTDB markAllAsRead error', err);
      }
    }

    this.memStore.notifications.forEach((n) => {
      if ((n.hospitalId === hospitalId || n.hospitalId === 'hospital-citycare-001') && !n.read) {
        n.read = true;
        count++;
      }
    });

    return count;
  }
}
