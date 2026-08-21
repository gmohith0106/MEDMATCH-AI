import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { Hospital, UpdateHospitalDto } from '../types/hospital.types';
import { getCurrentIsoDate } from '../utils/dates';
import { MemoryStore } from './memory-store';
import { logger } from '../utils/logger';

export class HospitalRepository {
  private ref = rtdb.ref('hospitals');
  private memStore = MemoryStore.getInstance();

  async findById(hospitalId: string): Promise<Hospital | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.child(hospitalId).once('value');
        if (snapshot.exists()) {
          return snapshot.val() as Hospital;
        }
      } catch (err) {
        logger.warn(`[HospitalRepository] RTDB findById error for ${hospitalId}`, err);
      }
    }
    return this.memStore.hospitals.get(hospitalId) || this.memStore.hospitals.get('hospital-citycare-001') || null;
  }

  async create(hospital: Hospital): Promise<Hospital> {
    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(hospital.id).set(hospital);
      } catch (err) {
        logger.warn(`[HospitalRepository] RTDB create error for ${hospital.id}`, err);
      }
    }
    this.memStore.hospitals.set(hospital.id, hospital);
    return hospital;
  }

  async update(hospitalId: string, updates: UpdateHospitalDto): Promise<Hospital | null> {
    const existing = await this.findById(hospitalId);
    if (!existing) return null;

    const updatedData: Hospital = {
      ...existing,
      ...updates,
      updatedAt: getCurrentIsoDate()
    };

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(hospitalId).update(updatedData);
      } catch (err) {
        logger.warn(`[HospitalRepository] RTDB update error for ${hospitalId}`, err);
      }
    }

    this.memStore.hospitals.set(hospitalId, updatedData);
    return updatedData;
  }
}
