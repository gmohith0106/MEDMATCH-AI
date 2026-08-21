import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { DataSourceRecord } from '../types/data-source.types';
import { MemoryStore } from './memory-store';
import { getCurrentIsoDate } from '../utils/dates';
import { logger } from '../utils/logger';

export class DataSourceRepository {
  private ref = rtdb.ref('dataSources');
  private memStore = MemoryStore.getInstance();

  async findAll(): Promise<DataSourceRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          return Object.values(val);
        }
      } catch (err) {
        logger.warn('[DataSourceRepository] RTDB read error', err);
      }
    }
    return Array.from(this.memStore.dataSources.values());
  }

  async findById(id: string): Promise<DataSourceRecord | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.child(id).once('value');
        if (snapshot.exists()) {
          return snapshot.val() as DataSourceRecord;
        }
      } catch (err) {
        logger.warn(`[DataSourceRepository] RTDB findById error for ${id}`, err);
      }
    }
    return this.memStore.dataSources.get(id) || null;
  }

  async update(id: string, updates: Partial<DataSourceRecord>): Promise<DataSourceRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: DataSourceRecord = {
      ...existing,
      ...updates,
      lastUpdated: getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(id).update(updated);
      } catch (err) {
        logger.warn(`[DataSourceRepository] RTDB update error for ${id}`, err);
      }
    }

    this.memStore.dataSources.set(id, updated);
    return updated;
  }
}
