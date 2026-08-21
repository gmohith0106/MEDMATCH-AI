export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'HEALTHY';
export type InventoryStatus = 'CRITICAL' | 'WARNING' | 'HEALTHY';

export interface InventoryItem {
  id: string;
  itemId?: string;
  hospitalId: string;
  name: string;
  productName?: string;
  category: string;
  currentStock: number;
  dailyUsage: number;
  recentUsage?: number;
  predictedDemand?: number;
  shortageQuantity?: number;
  reorderPoint: number;
  unit: string;
  status: InventoryStatus;
  riskLevel?: RiskLevel | string;
  stockoutDate?: string | null;
  daysRemaining: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateInventoryDto {
  name: string;
  productName?: string;
  category: string;
  currentStock: number;
  dailyUsage: number;
  recentUsage?: number;
  predictedDemand?: number;
  shortageQuantity?: number;
  reorderPoint: number;
  unit: string;
  riskLevel?: RiskLevel;
  stockoutDate?: string | null;
}

export interface UpdateInventoryDto {
  name?: string;
  productName?: string;
  category?: string;
  currentStock?: number;
  dailyUsage?: number;
  recentUsage?: number;
  predictedDemand?: number;
  shortageQuantity?: number;
  reorderPoint?: number;
  unit?: string;
  riskLevel?: RiskLevel;
  stockoutDate?: string | null;
}

export interface InventoryUsageRecord {
  id: string;
  inventoryId: string;
  hospitalId: string;
  date: string;
  quantityUsed: number;
  remainingStock: number;
  createdAt: string;
}

export interface InventoryQueryParams {
  search?: string;
  category?: string;
  status?: InventoryStatus;
  riskLevel?: RiskLevel;
  page?: number;
  limit?: number;
}
