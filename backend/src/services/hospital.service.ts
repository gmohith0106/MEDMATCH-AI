import { HospitalRepository } from '../repositories/hospital.repository';
import { Hospital, UpdateHospitalDto } from '../types/hospital.types';
import { AppError } from '../utils/errors';

export class HospitalService {
  private repo = new HospitalRepository();

  async getHospital(hospitalId: string): Promise<Hospital> {
    const hospital = await this.repo.findById(hospitalId);
    if (!hospital) {
      throw new AppError('Hospital workspace not found', 404, 'HOSPITAL_NOT_FOUND');
    }
    return hospital;
  }

  async updateHospital(hospitalId: string, updates: UpdateHospitalDto): Promise<Hospital> {
    const updated = await this.repo.update(hospitalId, updates);
    if (!updated) {
      throw new AppError('Hospital not found or update failed', 404, 'HOSPITAL_NOT_FOUND');
    }
    return updated;
  }
}
