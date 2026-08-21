import { v4 as uuidv4 } from 'uuid';
import { ActivityRepository } from '../repositories/activity.repository';
import { ActivityQueryParams, ActivityRecord } from '../types/activity.types';
import { getCurrentIsoDate } from '../utils/dates';

export class ActivityService {
  private repo = new ActivityRepository();

  async getActivities(
    hospitalId: string,
    params?: ActivityQueryParams
  ): Promise<{ activities: ActivityRecord[]; total: number; page: number; limit: number }> {
    return this.repo.findByHospital(hospitalId, params);
  }

  async logActivity(
    hospitalId: string,
    userId: string,
    type: string,
    message: string,
    runId?: string,
    metadata?: Record<string, unknown>
  ): Promise<ActivityRecord> {
    const activity: ActivityRecord = {
      id: `act-${uuidv4().substring(0, 8)}`,
      hospitalId,
      userId,
      runId,
      type,
      message,
      metadata,
      createdAt: getCurrentIsoDate()
    };
    return this.repo.create(activity);
  }
}
