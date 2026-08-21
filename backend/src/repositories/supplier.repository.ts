import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { Supplier, SupplierAnalysis } from '../types/supplier.types';
import { getCurrentIsoDate } from '../utils/dates';
import { MemoryStore } from './memory-store';
import { logger } from '../utils/logger';

export class SupplierRepository {
  private ref = rtdb.ref('suppliers');
  private analysisRef = rtdb.ref('supplierAnalyses');
  private memStore = MemoryStore.getInstance();

  async findAll(): Promise<Supplier[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: Supplier[] = Object.values(val);
          return list;
        }
      } catch (err) {
        logger.warn('[SupplierRepository] RTDB list error', err);
      }
    }
    return Array.from(this.memStore.suppliers.values());
  }

  async findById(id: string): Promise<Supplier | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.child(id).once('value');
        if (snapshot.exists()) {
          return snapshot.val() as Supplier;
        }
      } catch (err) {
        logger.warn(`[SupplierRepository] RTDB findById error for ${id}`, err);
      }
    }
    return this.memStore.suppliers.get(id) || null;
  }

  async findByCategory(category: string): Promise<Supplier[]> {
    const all = await this.findAll();
    const filtered = all.filter((s) => s.category?.toLowerCase() === category.toLowerCase());
    return filtered.length > 0 ? filtered : all;
  }

  async create(supplier: Supplier): Promise<Supplier> {
    const record: Supplier = {
      ...supplier,
      unitPrice: supplier.unitPrice ?? supplier.pricePerUnit ?? 0,
      pricePerUnit: supplier.pricePerUnit ?? supplier.unitPrice ?? 0,
      deliveryTime: supplier.deliveryTime ?? supplier.deliveryDays ?? 2,
      deliveryDays: supplier.deliveryDays ?? supplier.deliveryTime ?? 2,
      reliability: supplier.reliability ?? supplier.reliabilityScore ?? 95,
      reliabilityScore: supplier.reliabilityScore ?? supplier.reliability ?? 95,
      availability: supplier.availability ?? supplier.availabilityScore ?? 98,
      active: supplier.active ?? true,
      createdAt: supplier.createdAt || getCurrentIsoDate(),
      updatedAt: supplier.updatedAt || getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(record.id).set(record);
      } catch (err) {
        logger.warn(`[SupplierRepository] RTDB create error for ${record.id}`, err);
      }
    }
    this.memStore.suppliers.set(record.id, record);
    return record;
  }

  async saveAnalysis(analysis: SupplierAnalysis): Promise<SupplierAnalysis> {
    if (hasDatabaseCredentials) {
      try {
        await this.analysisRef.child(analysis.id).set(analysis);
      } catch (err) {
        logger.warn(`[SupplierRepository] RTDB analysis write error for ${analysis.id}`, err);
      }
    }
    return analysis;
  }

  async findAnalyses(hospitalId: string, inventoryId: string): Promise<SupplierAnalysis[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.analysisRef.orderByChild('inventoryId').equalTo(inventoryId).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const results: SupplierAnalysis[] = Object.values(val);
          results.sort((a, b) => a.rank - b.rank);
          return results;
        }
      } catch (err) {
        logger.warn(`[SupplierRepository] RTDB analyses query error for ${inventoryId}`, err);
      }
    }
    return [];
  }
}
