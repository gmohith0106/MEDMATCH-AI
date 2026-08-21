import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import {
  InventoryItem,
  InventoryQueryParams,
  InventoryUsageRecord,
  UpdateInventoryDto
} from '../types/inventory.types';
import { getCurrentIsoDate } from '../utils/dates';
import { MemoryStore } from './memory-store';
import { logger } from '../utils/logger';

export class InventoryRepository {
  private ref = rtdb.ref('inventory');
  private usageRef = rtdb.ref('inventoryUsage');
  private memStore = MemoryStore.getInstance();

  async findByHospital(
    hospitalId: string,
    params?: InventoryQueryParams
  ): Promise<{ items: InventoryItem[]; total: number; page: number; limit: number }> {
    let items: InventoryItem[] = [];

    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          items = Object.values(val);
        }
      } catch (err) {
        logger.warn('[InventoryRepository] RTDB read error', err);
      }
    }

    if (items.length === 0) {
      items = Array.from(this.memStore.inventory.values());
    }

    // Filter by hospital
    items = items.filter(
      (item) => item.hospitalId === hospitalId || item.hospitalId === 'hospital-citycare-001' || !item.hospitalId
    );

    if (params?.category) {
      items = items.filter((item) => item.category === params.category);
    }
    if (params?.status) {
      items = items.filter((item) => item.status === params.status || item.riskLevel === params.status);
    }
    if (params?.riskLevel) {
      items = items.filter((item) => item.riskLevel === params.riskLevel || item.status === params.riskLevel);
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      items = items.filter(
        (item) =>
          (item.productName && item.productName.toLowerCase().includes(searchTerm)) ||
          (item.name && item.name.toLowerCase().includes(searchTerm)) ||
          (item.category && item.category.toLowerCase().includes(searchTerm))
      );
    }

    items.sort((a, b) => (a.productName || a.name || '').localeCompare(b.productName || b.name || ''));

    const total = items.length;
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit
    };
  }

  async findById(hospitalId: string, id: string): Promise<InventoryItem | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.child(id).once('value');
        if (snapshot.exists()) {
          const data = snapshot.val() as InventoryItem;
          if (!data.hospitalId || data.hospitalId === hospitalId || data.hospitalId === 'hospital-citycare-001') {
            return data;
          }
        }
      } catch (err) {
        logger.warn(`[InventoryRepository] RTDB findById error for ${id}`, err);
      }
    }

    const item = this.memStore.inventory.get(id);
    if (item && (!item.hospitalId || item.hospitalId === hospitalId || item.hospitalId === 'hospital-citycare-001')) {
      return item;
    }
    return null;
  }

  async create(item: InventoryItem): Promise<InventoryItem> {
    const record: InventoryItem = {
      ...item,
      productName: item.productName || item.name || 'Clinical Item',
      name: item.name || item.productName || 'Clinical Item',
      recentUsage: item.recentUsage ?? item.dailyUsage ?? 0,
      dailyUsage: item.dailyUsage ?? item.recentUsage ?? 0,
      shortageQuantity: item.shortageQuantity ?? 0,
      predictedDemand: item.predictedDemand ?? 0,
      riskLevel: item.riskLevel || item.status || 'HEALTHY',
      status: item.status || (item.riskLevel as any) || 'HEALTHY',
      createdAt: item.createdAt || getCurrentIsoDate(),
      updatedAt: item.updatedAt || getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(record.id).set(record);
      } catch (err) {
        logger.warn(`[InventoryRepository] RTDB create error for ${record.id}`, err);
      }
    }
    this.memStore.inventory.set(record.id, record);
    return record;
  }

  async update(
    hospitalId: string,
    id: string,
    updates: UpdateInventoryDto & { status?: InventoryItem['status']; daysRemaining?: number | null; riskLevel?: string }
  ): Promise<InventoryItem | null> {
    const existing = await this.findById(hospitalId, id);
    if (!existing) return null;

    const updatedData: InventoryItem = {
      ...existing,
      ...updates,
      productName: updates.productName || updates.name || existing.productName || existing.name || '',
      name: updates.name || updates.productName || existing.name || existing.productName || '',
      recentUsage: updates.recentUsage ?? updates.dailyUsage ?? existing.recentUsage ?? existing.dailyUsage ?? 0,
      dailyUsage: updates.dailyUsage ?? updates.recentUsage ?? existing.dailyUsage ?? existing.recentUsage ?? 0,
      updatedAt: getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(id).update(updatedData);
      } catch (err) {
        logger.warn(`[InventoryRepository] RTDB update error for ${id}`, err);
      }
    }

    this.memStore.inventory.set(id, updatedData);
    return updatedData;
  }

  async delete(hospitalId: string, id: string): Promise<boolean> {
    const existing = await this.findById(hospitalId, id);
    if (!existing) return false;

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(id).remove();
      } catch (err) {
        logger.warn(`[InventoryRepository] RTDB delete error for ${id}`, err);
      }
    }

    this.memStore.inventory.delete(id);
    return true;
  }

  async recordUsage(usage: InventoryUsageRecord): Promise<InventoryUsageRecord> {
    if (hasDatabaseCredentials) {
      try {
        await this.usageRef.child(usage.id).set(usage);
      } catch (err) {
        logger.warn(`[InventoryRepository] RTDB usage write error for ${usage.id}`, err);
      }
    }
    this.memStore.inventoryUsage.set(usage.id, usage);
    return usage;
  }

  async findHistory(hospitalId: string, inventoryId: string): Promise<InventoryUsageRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.usageRef.orderByChild('inventoryId').equalTo(inventoryId).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const records: InventoryUsageRecord[] = Object.values(val);
          records.sort((a, b) => b.date.localeCompare(a.date));
          return records;
        }
      } catch (err) {
        logger.warn(`[InventoryRepository] RTDB history error for ${inventoryId}`, err);
      }
    }

    const records = Array.from(this.memStore.inventoryUsage.values()).filter(
      (u) =>
        (u.hospitalId === hospitalId || u.hospitalId === 'hospital-citycare-001') &&
        u.inventoryId === inventoryId
    );
    records.sort((a, b) => b.date.localeCompare(a.date));
    return records;
  }
}
