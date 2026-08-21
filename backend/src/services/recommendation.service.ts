import { RecommendationRepository } from '../repositories/recommendation.repository';
import { RecommendationRecord } from '../types/procurement.types';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class RecommendationService {
  private repo = new RecommendationRepository();

  async getRecommendationById(id: string): Promise<RecommendationRecord> {
    const rec = await this.repo.findById(id);
    if (!rec) {
      throw new AppError(`Recommendation ${id} not found`, 404, 'RECOMMENDATION_NOT_FOUND');
    }
    return rec;
  }

  async getRecommendationByRunId(runId: string): Promise<RecommendationRecord> {
    const rec = await this.repo.findByRunId(runId);
    if (!rec) {
      throw new AppError(
        `Recommendation for agent run ${runId} not found`,
        404,
        'RECOMMENDATION_NOT_FOUND'
      );
    }
    return rec;
  }

  async getRecommendationsByHospital(hospitalId: string): Promise<RecommendationRecord[]> {
    return this.repo.findByHospital(hospitalId);
  }

  async rejectRecommendation(id: string, hospitalId: string): Promise<RecommendationRecord> {
    const existing = await this.getRecommendationById(id);
    if (existing.hospitalId !== hospitalId) {
      throw new AppError('Unauthorized access to recommendation', 403, 'FORBIDDEN');
    }

    if (existing.status !== 'PENDING_APPROVAL') {
      throw new AppError(
        `Cannot reject recommendation in ${existing.status} status`,
        400,
        'PROCUREMENT_NOT_APPROVABLE'
      );
    }

    const updated = await this.repo.updateStatus(id, 'REJECTED');
    if (!updated) {
      throw new AppError('Failed to reject recommendation', 500, 'INTERNAL_ERROR');
    }

    logger.info(`Recommendation ${id} was rejected by user in hospital ${hospitalId}`);
    return updated;
  }
}
