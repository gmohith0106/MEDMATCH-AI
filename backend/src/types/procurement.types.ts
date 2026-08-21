export type RecommendationStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export type ProcurementStatus =
  | 'SHORTAGE_DETECTED'
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_PROCESSING'
  | 'SETTLEMENT_PENDING'
  | 'SUPPLIER_ANALYSIS'
  | 'RECOMMENDATION_READY'
  | 'APPROVED'
  | 'REJECTED'
  | 'PENDING_APPROVAL'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface RecommendationRecord {
  id: string;
  runId?: string;
  hospitalId: string;
  inventoryId: string;
  inventoryName: string;
  productId?: string;
  productName?: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  unitPrice: number;
  price?: number;
  estimatedCost: number;
  deliveryDays: number;
  deliveryTime?: number;
  supplierScore: number;
  score?: number;
  estimatedSavings: number;
  reasoning: string;
  reason?: string;
  status: RecommendationStatus;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ProcurementRequestRecord {
  id: string;
  hospitalId: string;
  userId: string;
  recommendationId: string;
  inventoryId: string;
  inventoryName: string;
  productId?: string;
  productName?: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  estimatedCost: number;
  currentStock?: number;
  predictedDemand?: number;
  requiredQuantity?: number;
  shortageQuantity?: number;
  status: ProcurementStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  recommendedSupplierId?: string;
  recommendedSupplierName?: string;
  approvalStatus?: RecommendationStatus;
  createdBy?: string;
}

export interface CreateProcurementDto {
  recommendationId: string;
  supplierId: string;
  inventoryId: string;
  quantity: number;
  estimatedCost: number;
}
