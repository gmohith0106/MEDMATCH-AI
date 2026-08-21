import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { ActivityQueryParams, ActivityRecord } from '../types/activity.types';
import { MemoryStore } from './memory-store';
import { logger } from '../utils/logger';

export class ActivityRepository {
  private ref = rtdb.ref('activityEvents');
  private memStore = MemoryStore.getInstance();

  async create(activity: ActivityRecord): Promise<ActivityRecord> {
    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(activity.id).set(activity);
      } catch (err) {
        logger.warn(`[ActivityRepository] RTDB write error for ${activity.id}`, err);
      }
    }
    this.memStore.activities.set(activity.id, activity);
    return activity;
  }

  async findByHospital(
    hospitalId: string,
    params?: ActivityQueryParams
  ): Promise<{ activities: ActivityRecord[]; total: number; page: number; limit: number }> {
    let items: ActivityRecord[] = [];

    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          items = Object.values(val);
        }
      } catch (err) {
        logger.warn('[ActivityRepository] RTDB read error', err);
      }
    }

    if (items.length === 0) {
      items = Array.from(this.memStore.activities.values()).filter(
        (a) => a.hospitalId === hospitalId || a.hospitalId === 'hospital-citycare-001'
      );
    }

    if (params?.type) {
      items = items.filter((a) => a.type === params.type);
    }
    if (params?.runId) {
      items = items.filter((a) => a.runId === params.runId);
    }

    items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    const total = items.length;
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      activities: paginatedItems,
      total,
      page,
      limit
    };
  }
}
