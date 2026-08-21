export type ProcurementStatus = 'Pending' | 'Approved' | 'Completed' | 'Cancelled';

export interface ProcurementTimelineEvent {
  step: 'Recommendation Generated' | 'Human Approval' | 'Procurement Created' | 'Supplier Confirmation' | 'Completed';
  status: 'completed' | 'current' | 'pending' | 'demo_state';
  timestamp?: string;
  actor?: string;
  notes?: string;
}

export interface ProcurementRequest {
  id: string;
  requestId: string; // e.g. "REQ-001"
  itemId: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  estimatedCost: number; // in ₹
  supplierId: string;
  supplierName: string;
  deliveryDays: number;
  supplierScore: number;
  status: ProcurementStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  agentRunId?: string;
  paymentId?: string;
  timeline: ProcurementTimelineEvent[];
  notes?: string;
}
