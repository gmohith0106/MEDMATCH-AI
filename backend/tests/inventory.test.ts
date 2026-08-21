import { InventoryService } from '../src/services/inventory.service';

describe('Inventory Service - Status & Days Remaining Calculation', () => {
  it('should calculate CRITICAL status when daysRemaining <= 3', () => {
    // 120 current stock, 42 daily usage -> 120 / 42 = ~2.9 days
    const result = InventoryService.calculateStatus(120, 42);
    expect(result.status).toBe('CRITICAL');
    expect(result.daysRemaining).toBe(2.9);
  });

  it('should calculate WARNING status when 3 < daysRemaining <= 7', () => {
    // 210 current stock, 38 daily usage -> 210 / 38 = ~5.5 days
    const result = InventoryService.calculateStatus(210, 38);
    expect(result.status).toBe('WARNING');
    expect(result.daysRemaining).toBe(5.5);
  });

  it('should calculate HEALTHY status when daysRemaining > 7', () => {
    // 580 current stock, 75 daily usage -> 580 / 75 = ~7.7 days
    const result = InventoryService.calculateStatus(580, 75);
    expect(result.status).toBe('HEALTHY');
    expect(result.daysRemaining).toBe(7.7);
  });

  it('should return HEALTHY and null daysRemaining when dailyUsage is 0', () => {
    const result = InventoryService.calculateStatus(100, 0);
    expect(result.status).toBe('HEALTHY');
    expect(result.daysRemaining).toBeNull();
  });
});
