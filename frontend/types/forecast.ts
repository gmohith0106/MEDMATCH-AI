export interface ForecastItem {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  currentStock: number;
  dailyUsage: number;
  projectedDemand7d: number;
  expectedShortage: number;
  riskHorizonDays: number;
  urgency: 'Critical' | 'Warning' | 'Low';
  confidenceScore: number; // e.g. 96.4%
  timeline: {
    day: string;
    forecastDemand: number;
    projectedStock: number;
    safetyThreshold: number;
  }[];
}

export interface SupplyRisk {
  id: string;
  itemId: string;
  itemName: string;
  projectedShortage: number;
  expectedWithinDays: number;
  priority: 'Critical' | 'Warning';
  riskScore: number;
  burnRate: number;
  recommendedOrderQty: number;
}
