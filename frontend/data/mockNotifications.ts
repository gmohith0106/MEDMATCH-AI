import { AppNotification } from '@/types';

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Critical Inventory Alert',
    message: 'N95 Respirator Masks are projected to fall below safety threshold in 2.9 days.',
    timestamp: '10m ago',
    type: 'critical_inventory',
    read: false,
    actionUrl: '/agent',
    actionLabel: 'Run Agent',
  },
  {
    id: 'notif-2',
    title: 'Procurement Approval Required',
    message: 'Supplier recommendation is ready for N95 Masks (MediSupply - ₹1,900).',
    timestamp: '25m ago',
    type: 'approval_required',
    read: false,
    actionUrl: '/recommendation',
    actionLabel: 'Review',
  },
  {
    id: 'notif-3',
    title: 'x402 Micropayment Settled',
    message: 'x402 demo payment completed ($0.02) on Algorand TestNet (DEMO-TXN-001).',
    timestamp: '45m ago',
    type: 'payment_complete',
    read: true,
    actionUrl: '/payments',
    actionLabel: 'View TXN',
  },
  {
    id: 'notif-4',
    title: 'Secondary Risk: IV Infusion Sets',
    message: 'IV Infusion Sets approaching 3.9 days safety stock limit.',
    timestamp: '2h ago',
    type: 'critical_inventory',
    read: true,
    actionUrl: '/inventory/inv-iv-sets',
    actionLabel: 'Inspect',
  },
];
