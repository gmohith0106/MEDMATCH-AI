import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { RecommendationRecord, RecommendationStatus } from '../types/procurement.types';
import { MemoryStore } from './memory-store';
import { getCurrentIsoDate } from '../utils/dates';
import { logger } from '../utils/logger';

export class RecommendationRepository {
  private ref = rtdb.ref('recommendations');
  private memStore = MemoryStore.getInstance();

  async create(rec: RecommendationRecord): Promise<RecommendationRecord> {
    const record: RecommendationRecord = {
      ...rec,
      productName: rec.productName || rec.inventoryName || 'Medical Supply',
      price: rec.price ?? rec.unitPrice ?? 0,
      unitPrice: rec.unitPrice ?? rec.price ?? 0,
      deliveryTime: rec.deliveryTime ?? rec.deliveryDays ?? 2,
      deliveryDays: rec.deliveryDays ?? rec.deliveryTime ?? 2,
      score: rec.score ?? rec.supplierScore ?? 90,
      reason: rec.reason || rec.reasoning || 'Optimized clinical pricing and delivery timeline',
      status: rec.status || 'PENDING_APPROVAL',
      createdAt: rec.createdAt || getCurrentIsoDate(),
      updatedAt: rec.updatedAt || getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(record.id).set(record);
      } catch (err) {
        logger.warn(`[RecommendationRepository] RTDB create error for ${record.id}`, err);
      }
    }
    this.memStore.recommendations.set(record.id, record);
    return record;
  }

  async findById(id: string, hospitalId?: string): Promise<RecommendationRecord | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.child(id).once('value');
        if (snapshot.exists()) {
          const data = snapshot.val() as RecommendationRecord;
          if (!hospitalId || !data.hospitalId || data.hospitalId === hospitalId || data.hospitalId === 'hospital-citycare-001') {
            return data;
          }
        }
      } catch (err) {
        logger.warn(`[RecommendationRepository] RTDB findById error for ${id}`, err);
      }
    }

    const rec = this.memStore.recommendations.get(id);
    if (rec && (!hospitalId || !rec.hospitalId || rec.hospitalId === hospitalId || rec.hospitalId === 'hospital-citycare-001')) {
      return rec;
    }
    return null;
  }

  async findByHospital(hospitalId: string): Promise<RecommendationRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const records: RecommendationRecord[] = Object.values(val);
          records.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          return records;
        }
      } catch (err) {
        logger.warn('[RecommendationRepository] RTDB list error', err);
      }
    }

    const records = Array.from(this.memStore.recommendations.values()).filter(
      (r) => !r.hospitalId || r.hospitalId === hospitalId || r.hospitalId === 'hospital-citycare-001'
    );
    records.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return records;
  }

  async findByRunId(runId: string): Promise<RecommendationRecord | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.orderByChild('runId').equalTo(runId).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const firstKey = Object.keys(val)[0];
          if (firstKey) return val[firstKey] as RecommendationRecord;
        }
      } catch (err) {
        logger.warn(`[RecommendationRepository] RTDB findByRunId error for ${runId}`, err);
      }
    }

    const all = Array.from(this.memStore.recommendations.values());
    return all.find((r) => r.runId === runId) || null;
  }

  async updateStatus(id: string, status: RecommendationStatus, approvedBy?: string): Promise<RecommendationRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const now = getCurrentIsoDate();
    const updated: RecommendationRecord = {
      ...existing,
      status,
      updatedAt: now,
      ...(approvedBy ? { approvedBy, approvedAt: now } : {})
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(id).update(updated);
      } catch (err) {
        logger.warn(`[RecommendationRepository] RTDB update error for ${id}`, err);
      }
    }

    this.memStore.recommendations.set(id, updated);
    return updated;
  }
}
