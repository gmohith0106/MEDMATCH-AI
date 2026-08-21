import { v4 as uuidv4 } from 'uuid';
import { InventoryRepository } from '../repositories/inventory.repository';
import { AgentRepository } from '../repositories/agent.repository';
import { ForecastRecord } from '../types/agent.types';
import { getCurrentIsoDate } from '../utils/dates';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class ForecastService {
  private inventoryRepo = new InventoryRepository();
  private agentRepo = new AgentRepository();

  public static calculateForecast(
    dailyUsage: number,
    forecastDays: number = 7
  ): { estimatedDemand: number; dailyEstimate: number } {
    const dailyEstimate = Math.max(0, dailyUsage);
    const estimatedDemand = Math.round(dailyEstimate * forecastDays);
    return { estimatedDemand, dailyEstimate };
  }

  async getForecastForInventory(
    hospitalId: string,
    inventoryId: string,
    forecastDays: number = 7
  ): Promise<ForecastRecord> {
    const item = await this.inventoryRepo.findById(hospitalId, inventoryId);
    if (!item) {
      throw new AppError(`Inventory item ${inventoryId} not found`, 404, 'INVENTORY_NOT_FOUND');
    }

    const { estimatedDemand, dailyEstimate } = ForecastService.calculateForecast(
      item.dailyUsage,
      forecastDays
    );

    const forecastRecord: ForecastRecord = {
      id: `fc-${uuidv4().substring(0, 8)}`,
      hospitalId,
      inventoryId: item.id,
      inventoryName: item.name,
      forecastDays,
      estimatedDemand,
      dailyEstimate,
      modelType: '7_DAY_MOVING_AVERAGE',
      confidenceLabel: 'Calculated from available inventory data',
      createdAt: getCurrentIsoDate()
    };

    await this.agentRepo.saveForecast(forecastRecord);
    logger.info(`Generated forecast for ${item.name}: ${estimatedDemand} units over ${forecastDays} days`);

    return forecastRecord;
  }

  async getHospitalForecasts(
    hospitalId: string,
    forecastDays: number = 7
  ): Promise<ForecastRecord[]> {
    const { items } = await this.inventoryRepo.findByHospital(hospitalId, { limit: 100 });
    const forecasts: ForecastRecord[] = [];

    for (const item of items) {
      const { estimatedDemand, dailyEstimate } = ForecastService.calculateForecast(
        item.dailyUsage,
        forecastDays
      );

      const forecastRecord: ForecastRecord = {
        id: `fc-${uuidv4().substring(0, 8)}`,
        hospitalId,
        inventoryId: item.id,
        inventoryName: item.name,
        forecastDays,
        estimatedDemand,
        dailyEstimate,
        modelType: '7_DAY_MOVING_AVERAGE',
        confidenceLabel: 'Calculated from available inventory data',
        createdAt: getCurrentIsoDate()
      };

      await this.agentRepo.saveForecast(forecastRecord);
      forecasts.push(forecastRecord);
    }

    return forecasts;
  }
}

