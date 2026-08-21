import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { ProcurementRequestRecord, ProcurementStatus } from '../types/procurement.types';
import { getCurrentIsoDate } from '../utils/dates';
import { MemoryStore } from './memory-store';
import { logger } from '../utils/logger';

export class ProcurementRepository {
  private ref = rtdb.ref('procurements');
  private memStore = MemoryStore.getInstance();

  async create(req: ProcurementRequestRecord): Promise<ProcurementRequestRecord> {
    const record: ProcurementRequestRecord = {
      ...req,
      productId: req.productId || req.inventoryId || 'item-001',
      productName: req.productName || req.inventoryName || 'Medical Supply',
      currentStock: req.currentStock ?? 0,
      predictedDemand: req.predictedDemand ?? 0,
      requiredQuantity: req.requiredQuantity ?? req.quantity ?? 100,
      shortageQuantity: req.shortageQuantity ?? 0,
      status: req.status || 'SHORTAGE_DETECTED',
      createdBy: req.createdBy || req.userId || 'staff-001',
      createdAt: req.createdAt || getCurrentIsoDate(),
      updatedAt: req.updatedAt || getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(record.id).set(record);
      } catch (err) {
        logger.warn(`[ProcurementRepository] RTDB create error for ${record.id}`, err);
      }
    }
    this.memStore.procurements.set(record.id, record);
    return record;
  }

  async findById(hospitalId: string, id: string): Promise<ProcurementRequestRecord | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.child(id).once('value');
        if (snapshot.exists()) {
          const data = snapshot.val() as ProcurementRequestRecord;
          if (!data.hospitalId || data.hospitalId === hospitalId || data.hospitalId === 'hospital-citycare-001') {
            return data;
          }
        }
      } catch (err) {
        logger.warn(`[ProcurementRepository] RTDB findById error for ${id}`, err);
      }
    }
    const proc = this.memStore.procurements.get(id);
    if (proc && (!proc.hospitalId || proc.hospitalId === hospitalId || proc.hospitalId === 'hospital-citycare-001')) {
      return proc;
    }
    return null;
  }

  async findByHospital(hospitalId: string): Promise<ProcurementRequestRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const requests: ProcurementRequestRecord[] = Object.values(val);
          requests.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          return requests;
        }
      } catch (err) {
        logger.warn('[ProcurementRepository] RTDB list error', err);
      }
    }
    const requests = Array.from(this.memStore.procurements.values()).filter(
      (p) => !p.hospitalId || p.hospitalId === hospitalId || p.hospitalId === 'hospital-citycare-001'
    );
    requests.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return requests;
  }

  async updateStatus(
    hospitalId: string,
    id: string,
    status: ProcurementStatus,
    approvedBy?: string
  ): Promise<ProcurementRequestRecord | null> {
    const existing = await this.findById(hospitalId, id);
    if (!existing) return null;

    const now = getCurrentIsoDate();
    const updates: Partial<ProcurementRequestRecord> = {
      status,
      updatedAt: now,
      ...(approvedBy ? { approvedBy, approvedAt: now, approvalStatus: status === 'APPROVED' ? 'APPROVED' : 'REJECTED' } : {})
    };

    const updated = { ...existing, ...updates } as ProcurementRequestRecord;

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(id).update(updated);
      } catch (err) {
        logger.warn(`[ProcurementRepository] RTDB update error for ${id}`, err);
      }
    }

    this.memStore.procurements.set(id, updated);
    return updated;
  }
}
