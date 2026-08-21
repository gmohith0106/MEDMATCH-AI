import { v4 as uuidv4 } from 'uuid';
import { ProcurementRepository } from '../repositories/procurement.repository';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import { InventoryRepository } from '../repositories/inventory.repository';
import { SupplierRepository } from '../repositories/supplier.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateProcurementDto, ProcurementRequestRecord } from '../types/procurement.types';
import { AppError } from '../utils/errors';
import { getCurrentIsoDate } from '../utils/dates';
import { logger } from '../utils/logger';

export class ProcurementService {
  private repo = new ProcurementRepository();
  private recommendationRepo = new RecommendationRepository();
  private inventoryRepo = new InventoryRepository();
  private supplierRepo = new SupplierRepository();
  private activityRepo = new ActivityRepository();
  private notificationRepo = new NotificationRepository();

  async getProcurements(hospitalId: string): Promise<ProcurementRequestRecord[]> {
    return this.repo.findByHospital(hospitalId);
  }

  async getProcurementById(hospitalId: string, id: string): Promise<ProcurementRequestRecord> {
    const procurement = await this.repo.findById(hospitalId, id);
    if (!procurement) {
      throw new AppError(`Procurement request ${id} not found`, 404, 'PROCUREMENT_NOT_FOUND');
    }
    return procurement;
  }

  async createProcurement(
    hospitalId: string,
    userId: string,
    dto: CreateProcurementDto
  ): Promise<ProcurementRequestRecord> {
    const recommendation = await this.recommendationRepo.findById(dto.recommendationId);
    if (!recommendation || recommendation.hospitalId !== hospitalId) {
      throw new AppError('Associated recommendation not found', 404, 'RECOMMENDATION_NOT_FOUND');
    }

    const inventory = await this.inventoryRepo.findById(hospitalId, dto.inventoryId);
    const supplier = await this.supplierRepo.findById(dto.supplierId);

    const now = getCurrentIsoDate();
    const procurement: ProcurementRequestRecord = {
      id: `proc-${uuidv4().substring(0, 8)}`,
      hospitalId,
      userId,
      recommendationId: dto.recommendationId,
      supplierId: dto.supplierId,
      supplierName: supplier?.name || recommendation.supplierName,
      inventoryId: dto.inventoryId,
      inventoryName: inventory?.name || recommendation.inventoryName,
      quantity: dto.quantity,
      estimatedCost: dto.estimatedCost,
      status: 'PENDING_APPROVAL', // Always pending human approval
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repo.create(procurement);

    // Record activity
    await this.activityRepo.create({
      id: `act-${uuidv4().substring(0, 8)}`,
      hospitalId,
      userId,
      type: 'PROCUREMENT_CREATED',
      message: `Procurement request created for ${procurement.quantity} ${inventory?.unit || 'units'} of ${procurement.inventoryName} from ${procurement.supplierName} ($${procurement.estimatedCost.toFixed(2)}) - Awaiting human approval.`,
      createdAt: now
    });

    return created;
  }

  async approveProcurement(
    hospitalId: string,
    userId: string,
    id: string
  ): Promise<ProcurementRequestRecord> {
    const existing = await this.getProcurementById(hospitalId, id);

    if (existing.status !== 'PENDING_APPROVAL') {
      throw new AppError(
        `Cannot approve procurement request in ${existing.status} status`,
        400,
        'PROCUREMENT_NOT_APPROVABLE'
      );
    }

    const updated = await this.repo.updateStatus(hospitalId, id, 'APPROVED', userId);
    if (!updated) {
      throw new AppError('Failed to approve procurement request', 500, 'INTERNAL_ERROR');
    }

    // Also update recommendation status to APPROVED
    if (existing.recommendationId) {
      await this.recommendationRepo.updateStatus(existing.recommendationId, 'APPROVED');
    }

    const now = getCurrentIsoDate();

    // Log activity
    await this.activityRepo.create({
      id: `act-${uuidv4().substring(0, 8)}`,
      hospitalId,
      userId,
      type: 'PROCUREMENT_APPROVED',
      message: `Procurement request ${id} for ${existing.inventoryName} was explicitly approved by authorized user.`,
      createdAt: now
    });

    // Notify user/hospital admins
    await this.notificationRepo.create({
      id: `notif-${uuidv4().substring(0, 8)}`,
      userId,
      hospitalId,
      title: 'Procurement Request Approved',
      message: `Order for ${existing.quantity} units of ${existing.inventoryName} (${existing.supplierName}) approved for processing.`,
      type: 'SUCCESS',
      read: false,
      createdAt: now
    });

    logger.info(`Procurement ${id} approved by user ${userId} in hospital ${hospitalId}`);
    return updated;
  }

  async cancelProcurement(
    hospitalId: string,
    userId: string,
    id: string
  ): Promise<ProcurementRequestRecord> {
    const existing = await this.getProcurementById(hospitalId, id);

    if (existing.status === 'COMPLETED' || existing.status === 'CANCELLED') {
      throw new AppError(
        `Cannot cancel procurement request in ${existing.status} status`,
        400,
        'PROCUREMENT_NOT_APPROVABLE'
      );
    }

    const updated = await this.repo.updateStatus(hospitalId, id, 'CANCELLED');
    if (!updated) {
      throw new AppError('Failed to cancel procurement request', 500, 'INTERNAL_ERROR');
    }

    const now = getCurrentIsoDate();
    await this.activityRepo.create({
      id: `act-${uuidv4().substring(0, 8)}`,
      hospitalId,
      userId,
      type: 'PROCUREMENT_CANCELLED',
      message: `Procurement request ${id} for ${existing.inventoryName} was cancelled.`,
      createdAt: now
    });

    return updated;
  }
}
