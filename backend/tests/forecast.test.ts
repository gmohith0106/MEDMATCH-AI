import { ForecastService } from '../src/services/forecast.service';
import { ShortageService } from '../src/services/shortage.service';
import { InventoryItem } from '../src/types/inventory.types';

describe('Forecast & Shortage Service - Transparent Demonstration Engine', () => {
  it('should calculate demand forecast using dailyUsage * forecastDays', () => {
    // 42 daily usage * 7 days = 294 estimated demand
    const result = ForecastService.calculateForecast(42, 7);
    expect(result.dailyEstimate).toBe(42);
    expect(result.estimatedDemand).toBe(294);
  });

  it('should evaluate potential shortage when estimatedDemand exceeds current stock', () => {
    const item: InventoryItem = {
      id: 'inv-test-01',
      hospitalId: 'hospital-test',
      name: 'N95 Masks',
      category: 'PPE',
      currentStock: 120,
      dailyUsage: 42,
      reorderPoint: 150,
      unit: 'boxes',
      status: 'CRITICAL',
      daysRemaining: 2.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const shortage = ShortageService.evaluateShortage(item, 7);
    expect(shortage).not.toBeNull();
    expect(shortage?.inventoryName).toBe('N95 Masks');
    expect(shortage?.forecastDemand).toBe(294);
    expect(shortage?.projectedShortage).toBe(174); // 294 - 120
    expect(shortage?.priority).toBe('CRITICAL');
  });

  it('should return null shortage when stock is ample and above reorder point', () => {
    const item: InventoryItem = {
      id: 'inv-test-02',
      hospitalId: 'hospital-test',
      name: 'Sterile Gauze',
      category: 'Consumables',
      currentStock: 1000,
      dailyUsage: 10,
      reorderPoint: 100,
      unit: 'packs',
      status: 'HEALTHY',
      daysRemaining: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const shortage = ShortageService.evaluateShortage(item, 7);
    expect(shortage).toBeNull();
  });
});
