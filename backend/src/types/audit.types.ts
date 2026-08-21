export type AuditAction =
  | 'LOGIN'
  | 'INVENTORY_CREATED'
  | 'INVENTORY_UPDATED'
  | 'INVENTORY_DELETED'
  | 'PROCUREMENT_STARTED'
  | 'PAYMENT_REQUESTED'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_FAILED'
  | 'RECOMMENDATION_CREATED'
  | 'RECOMMENDATION_APPROVED'
  | 'RECOMMENDATION_REJECTED'
  | 'STAFF_CREATED'
  | 'STAFF_UPDATED'
  | 'STAFF_ACTIVATED'
  | 'STAFF_DEACTIVATED';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction | string;
  entityType: 'USER' | 'INVENTORY' | 'PROCUREMENT' | 'PAYMENT' | 'RECOMMENDATION' | 'SYSTEM';
  entityId: string;
  details?: Record<string, unknown>;
  createdAt: string;
}
