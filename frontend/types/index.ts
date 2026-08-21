export * from './inventory';
export * from './forecast';
export * from './supplier';
export * from './agent';
export * from './payment';
export * from './procurement';
export * from './auth';
export * from './hospital.types';


export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'inventory' | 'agent' | 'payment' | 'procurement' | 'forecast' | 'system';
  status: 'info' | 'success' | 'warning' | 'alert';
  iconName: string;
  relatedId?: string;
  badgeText?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical_inventory' | 'agent_ready' | 'payment_complete' | 'approval_required' | 'info';
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface HospitalSettings {
  name: string;
  code: string;
  department: string;
  procurementManager: string;
  environment: 'Demo Mode' | 'Live TestNet' | 'Production';
  network: 'Algorand TestNet' | 'Algorand MainNet';
  paymentProtocol: 'x402';
  agentStatus: 'Online' | 'Offline' | 'Busy';
  safetyThresholdDays: number;
  autoApprovalThresholdInr: number;
}
