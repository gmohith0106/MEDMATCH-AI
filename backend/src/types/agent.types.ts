export type AgentRunStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type AgentStepType =
  | 'INVENTORY_ANALYSIS'
  | 'DEMAND_FORECAST'
  | 'SHORTAGE_DETECTION'
  | 'SUPPLIER_INTELLIGENCE'
  | 'X402_PAYMENT'
  | 'ALGORAND_SETTLEMENT'
  | 'SUPPLIER_RANKING'
  | 'RECOMMENDATION'
  | 'HUMAN_APPROVAL';

export type AgentStepStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface AgentStepRecord {
  id: string;
  runId: string;
  stepNumber: number;
  type: AgentStepType;
  status: AgentStepStatus;
  startedAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentEventRecord {
  id: string;
  runId: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AgentRunRecord {
  id: string;
  hospitalId: string;
  userId: string;
  inventoryItemId?: string;
  status: AgentRunStatus;
  currentStep: AgentStepType;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface ForecastRecord {
  id: string;
  hospitalId: string;
  inventoryId: string;
  inventoryName: string;
  forecastDays: number;
  estimatedDemand: number;
  dailyEstimate: number;
  modelType: '7_DAY_MOVING_AVERAGE' | 'DEMO_MOVING_AVERAGE' | string;
  confidenceLabel: string;
  createdAt: string;
}


export interface ShortageRecord {
  id: string;
  hospitalId: string;
  inventoryId: string;
  inventoryName: string;
  currentStock: number;
  reorderPoint: number;
  forecastDemand: number;
  projectedShortage: number;
  daysRemaining: number | null;
  priority: 'CRITICAL' | 'WARNING' | 'NORMAL';
  detectedAt: string;
}
