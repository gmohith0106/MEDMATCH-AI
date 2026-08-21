export type InventoryStatus = 'Critical' | 'Warning' | 'Healthy';

export type InventoryCategory = 
  | 'Protective Equipment'
  | 'Consumables'
  | 'Medication'
  | 'Surgical Supplies'
  | 'Diagnostic';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  dailyUsage: number;
  reorderPoint: number;
  daysRemaining: number;
  predictedDemand7d: number;
  expectedShortage: number;
  unit: string;
  unitCost: number;
  status: InventoryStatus;
  primarySupplierId?: string;
  lastUpdated: string;
  historicalDemand: {
    day: string;
    stock: number;
    forecast: number;
  }[];
}

export interface NewInventoryItemInput {
  name: string;
  category: InventoryCategory;
  currentStock: number;
  dailyUsage: number;
  reorderPoint: number;
  unit?: string;
  unitCost?: number;
}
