import { v4 as uuidv4 } from 'uuid';
import { InventoryRepository } from '../repositories/inventory.repository';
import {
  CreateInventoryDto,
  InventoryItem,
  InventoryQueryParams,
  InventoryStatus,
  InventoryUsageRecord,
  UpdateInventoryDto
} from '../types/inventory.types';
import { AppError } from '../utils/errors';
import { getCurrentIsoDate } from '../utils/dates';
import { logger } from '../utils/logger';

export class InventoryService {
  private repo = new InventoryRepository();

  public static calculateStatus(
    currentStock: number,
    dailyUsage: number
  ): { status: InventoryStatus; daysRemaining: number | null } {
    if (dailyUsage <= 0) {
      return {
        status: 'HEALTHY',
        daysRemaining: null
      };
    }

    const daysRemaining = Math.round((currentStock / dailyUsage) * 10) / 10;

    let status: InventoryStatus = 'HEALTHY';
    if (daysRemaining <= 3) {
      status = 'CRITICAL';
    } else if (daysRemaining <= 7) {
      status = 'WARNING';
    } else {
      status = 'HEALTHY';
    }

    return { status, daysRemaining };
  }

  async getInventory(
    hospitalId: string,
    params?: InventoryQueryParams
  ): Promise<{ items: InventoryItem[]; total: number; page: number; limit: number }> {
    return this.repo.findByHospital(hospitalId, params);
  }

  async getInventoryById(hospitalId: string, id: string): Promise<InventoryItem> {
    const item = await this.repo.findById(hospitalId, id);
    if (!item) {
      throw new AppError(`Inventory item ${id} not found in this hospital`, 404, 'INVENTORY_NOT_FOUND');
    }
    return item;
  }

  async createInventory(hospitalId: string, dto: CreateInventoryDto): Promise<InventoryItem> {
    const { status, daysRemaining } = InventoryService.calculateStatus(
      dto.currentStock,
      dto.dailyUsage
    );

    const now = getCurrentIsoDate();
    const newItem: InventoryItem = {
      id: `inv-${uuidv4().substring(0, 8)}`,
      hospitalId,
      name: dto.name,
      category: dto.category,
      currentStock: dto.currentStock,
      dailyUsage: dto.dailyUsage,
      reorderPoint: dto.reorderPoint,
      unit: dto.unit,
      status,
      daysRemaining,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repo.create(newItem);
    logger.info(`Created inventory item: ${created.name} (${created.id}) for hospital ${hospitalId}`);
    return created;
  }

  async updateInventory(
    hospitalId: string,
    id: string,
    dto: UpdateInventoryDto
  ): Promise<InventoryItem> {
    const existing = await this.getInventoryById(hospitalId, id);

    const newCurrentStock = dto.currentStock !== undefined ? dto.currentStock : existing.currentStock;
    const newDailyUsage = dto.dailyUsage !== undefined ? dto.dailyUsage : existing.dailyUsage;

    const { status, daysRemaining } = InventoryService.calculateStatus(
      newCurrentStock,
      newDailyUsage
    );

    const updated = await this.repo.update(hospitalId, id, {
      ...dto,
      status,
      daysRemaining
    });

    if (!updated) {
      throw new AppError(`Failed to update inventory item ${id}`, 500, 'INTERNAL_ERROR');
    }

    return updated;
  }

  async deleteInventory(hospitalId: string, id: string): Promise<boolean> {
    const existing = await this.getInventoryById(hospitalId, id);
    if (!existing) {
      throw new AppError(`Inventory item ${id} not found`, 404, 'INVENTORY_NOT_FOUND');
    }

    return this.repo.delete(hospitalId, id);
  }

  async getInventoryHistory(hospitalId: string, id: string): Promise<InventoryUsageRecord[]> {
    // Verify item exists and belongs to hospital
    await this.getInventoryById(hospitalId, id);
    return this.repo.findHistory(hospitalId, id);
  }
}
