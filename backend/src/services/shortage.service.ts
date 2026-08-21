import { v4 as uuidv4 } from 'uuid';
import { InventoryRepository } from '../repositories/inventory.repository';
import { AgentRepository } from '../repositories/agent.repository';
import { ShortageRecord } from '../types/agent.types';
import { InventoryItem } from '../types/inventory.types';
import { getCurrentIsoDate } from '../utils/dates';
import { ForecastService } from './forecast.service';
import { logger } from '../utils/logger';

export class ShortageService {
  private inventoryRepo = new InventoryRepository();
  private agentRepo = new AgentRepository();

  public static evaluateShortage(
    item: InventoryItem,
    forecastDays: number = 7
  ): ShortageRecord | null {
    const { estimatedDemand } = ForecastService.calculateForecast(item.dailyUsage, forecastDays);

    const isShortage = estimatedDemand > item.currentStock || item.currentStock <= item.reorderPoint;

    if (!isShortage) {
      return null;
    }

    const projectedShortage = Math.max(0, estimatedDemand - item.currentStock);
    const daysRemaining = item.daysRemaining;

    let priority: ShortageRecord['priority'] = 'NORMAL';
    if (daysRemaining !== null && daysRemaining <= 3) {
      priority = 'CRITICAL';
    } else if (daysRemaining !== null && daysRemaining <= 7) {
      priority = 'WARNING';
    }

    return {
      id: `sht-${uuidv4().substring(0, 8)}`,
      hospitalId: item.hospitalId,
      inventoryId: item.id,
      inventoryName: item.name,
      currentStock: item.currentStock,
      reorderPoint: item.reorderPoint,
      forecastDemand: estimatedDemand,
      projectedShortage,
      daysRemaining,
      priority,
      detectedAt: getCurrentIsoDate()
    };
  }

  async detectShortagesForHospital(
    hospitalId: string,
    forecastDays: number = 7
  ): Promise<ShortageRecord[]> {
    const { items } = await this.inventoryRepo.findByHospital(hospitalId, { limit: 100 });
    const shortages: ShortageRecord[] = [];

    for (const item of items) {
      const shortage = ShortageService.evaluateShortage(item, forecastDays);
      if (shortage) {
        await this.agentRepo.saveShortage(shortage);
        shortages.push(shortage);
      }
    }

    // Sort by priority (CRITICAL -> WARNING -> NORMAL)
    const priorityWeight = { CRITICAL: 3, WARNING: 2, NORMAL: 1 };
    shortages.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

    logger.info(`Detected ${shortages.length} potential shortages for hospital ${hospitalId}`);
    return shortages;
  }
}
