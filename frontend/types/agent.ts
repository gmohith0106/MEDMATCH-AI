export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'waiting_action';

export interface AgentWorkflowStep {
  id: number;
  stepNumber: string; // "01", "02", etc.
  title: string;
  description: string;
  iconName: string;
  status: StepStatus;
  outputSummary?: string;
  timestamp?: string;
  durationMs?: number;
  details?: Record<string, any>;
}

export interface AgentLiveEvent {
  id: string;
  timestamp: string;
  stepId: number;
  title: string;
  detail: string;
  type: 'info' | 'success' | 'warning' | 'payment' | 'recommendation';
}

export interface AgentRunState {
  runId: string;
  status: 'idle' | 'running' | 'waiting_payment' | 'payment_completed' | 'waiting_approval' | 'completed' | 'cancelled';
  currentStepIndex: number;
  steps: AgentWorkflowStep[];
  events: AgentLiveEvent[];
  startedAt?: string;
  completedAt?: string;
  targetItem: {
    name: string;
    category: string;
    currentStock: number;
    shortageUnits: number;
    recommendedQty: number;
  };
  paymentRequired?: {
    amountUsd: number;
    service: string;
    protocol: string;
    network: string;
    isSimulated: boolean;
  };
  recommendationResult?: {
    supplierName: string;
    supplierScore: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalCost: number;
    deliveryDays: number;
    reliability: number;
    estimatedSavings: number;
    rationale: string;
  };
  procurementRequestId?: string;
}
