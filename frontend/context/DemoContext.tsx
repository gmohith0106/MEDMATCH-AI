'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { InventoryItem, NewInventoryItemInput } from '@/types/inventory';
import { ForecastItem, SupplyRisk } from '@/types/forecast';
import { Supplier, SupplierComparisonMatrix } from '@/types/supplier';
import { AgentWorkflowStep, AgentLiveEvent, AgentRunState } from '@/types/agent';
import { X402PaymentRecord, PaymentStats } from '@/types/payment';
import { ProcurementRequest } from '@/types/procurement';
import { ActivityItem, AppNotification, HospitalSettings } from '@/types';
import { initialInventory } from '@/data/mockInventory';
import { mockForecasts, mockSupplyRisks } from '@/data/mockForecast';
import { mockSuppliers, mockComparisonMatrix } from '@/data/mockSuppliers';
import { initialWorkflowSteps } from '@/data/mockAgent';
import { mockPayments } from '@/data/mockPayments';
import { mockProcurementRequests } from '@/data/mockProcurement';
import { mockActivities } from '@/data/mockActivity';
import { initialNotifications } from '@/data/mockNotifications';
import { runAgent } from '@/lib/api';


export interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface ClinicalTargetItemPreset {
  key: string;
  name: string;
  category: string;
  currentStock: number;
  dailyUsage: number;
  shortageUnits: number;
  recommendedQty: number;
  supplierName: string;
  supplierScore: number;
  unitPrice: number;
  totalCost: number;
  deliveryDays: number;
  reliability: number;
  estimatedSavings: number;
  rationale: string;
}

export const clinicalPresets: Record<string, ClinicalTargetItemPreset> = {
  gloves: {
    key: 'gloves',
    name: 'Surgical Gloves (Sterile, Latex-Free)',
    category: 'PPE & Surgical',
    currentStock: 1250,
    dailyUsage: 414,
    shortageUnits: 1650,
    recommendedQty: 1650,
    supplierName: 'MediSupply Healthcare Solutions',
    supplierScore: 94.6,
    unitPrice: 1.85,
    totalCost: 3052.50,
    deliveryDays: 2,
    reliability: 99.2,
    estimatedSavings: 480,
    rationale:
      'Based on inventory projection and supplier metrics, MediSupply provides the strongest combination of price, 2-day delivery speed, and 99.2% reliability, fulfilling stock before the critical 2.8-day exhaustion deadline.',
  },
  n95: {
    key: 'n95',
    name: 'N95 Respirator Masks',
    category: 'Protective Equipment',
    currentStock: 120,
    dailyUsage: 42,
    shortageUnits: 174,
    recommendedQty: 200,
    supplierName: 'MediSupply Healthcare Solutions',
    supplierScore: 94.6,
    unitPrice: 9.50,
    totalCost: 1900,
    deliveryDays: 2,
    reliability: 98,
    estimatedSavings: 420,
    rationale:
      'Based on inventory projection and supplier metrics, MediSupply provides the strongest combination of price, delivery speed, and reliability. Crucially, its 2-day lead time fulfills stock before the 2.9-day exhaustion deadline.',
  },
  syringes: {
    key: 'syringes',
    name: 'Sterile 5ml Disposable Syringes',
    category: 'Clinical Consumables',
    currentStock: 250,
    dailyUsage: 65,
    shortageUnits: 205,
    recommendedQty: 300,
    supplierName: 'CareMed Logistics',
    supplierScore: 89.8,
    unitPrice: 0.85,
    totalCost: 255,
    deliveryDays: 2,
    reliability: 96,
    estimatedSavings: 65,
    rationale:
      'CareMed Logistics maintains pre-allocated emergency stock of 5ml Luer Lock syringes ready for immediate dispatch with batch sterility certificates.',
  },
  saline: {
    key: 'saline',
    name: 'Normal Saline 0.9% IV Infusion (500ml)',
    category: 'IV Solutions & Fluids',
    currentStock: 45,
    dailyUsage: 18,
    shortageUnits: 81,
    recommendedQty: 100,
    supplierName: 'Apex Medical Supplies',
    supplierScore: 93.4,
    unitPrice: 2.20,
    totalCost: 220,
    deliveryDays: 1,
    reliability: 99,
    estimatedSavings: 45,
    rationale:
      'Apex Medical provides certified isotonic sodium chloride infusions with same-day emergency dispatch and verified batch cold storage chain.',
  },
};

export type ExecutionSpeed = 'normal' | 'fast' | 'turbo';

interface DemoContextType {
  inventory: InventoryItem[];
  addInventoryItem: (input: NewInventoryItemInput) => Promise<InventoryItem>;
  forecasts: ForecastItem[];
  supplyRisks: SupplyRisk[];
  suppliers: Supplier[];
  supplierMatrix: SupplierComparisonMatrix;
  procurements: ProcurementRequest[];
  createProcurementOrder: (req: Partial<ProcurementRequest>) => Promise<ProcurementRequest>;
  payments: X402PaymentRecord[];
  activities: ActivityItem[];
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toasts: ToastItem[];
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'alert') => void;
  removeToast: (id: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  hospitalSettings: HospitalSettings;
  updateHospitalSettings: (settings: Partial<HospitalSettings>) => void;
  
  // Agent Workflow Runner & Speed Enhancements
  agentState: AgentRunState;
  executionSpeed: ExecutionSpeed;
  setExecutionSpeed: (speed: ExecutionSpeed) => void;
  activePresetKey: string;
  selectTargetItemPreset: (presetKey: string) => void;
  autoApprovalEnabled: boolean;
  setAutoApprovalEnabled: (enabled: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isApprovalModalOpen: boolean;
  setIsApprovalModalOpen: (open: boolean) => void;
  currentPayment: X402PaymentRecord | null;
  setCurrentPayment: (pay: X402PaymentRecord | null) => void;
  startAgentRun: () => void;
  continuePaymentFlow: () => Promise<void>;
  confirmApprovalFlow: () => Promise<void>;
  resetAgentRun: () => void;
}


const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [forecasts] = useState<ForecastItem[]>(mockForecasts);
  const [supplyRisks] = useState<SupplyRisk[]>(mockSupplyRisks);
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [supplierMatrix] = useState<SupplierComparisonMatrix>(mockComparisonMatrix);
  const [procurements, setProcurements] = useState<ProcurementRequest[]>(mockProcurementRequests);
  const [payments, setPayments] = useState<X402PaymentRecord[]>(mockPayments);
  const [currentPayment, setCurrentPayment] = useState<X402PaymentRecord | null>(null);

  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const [executionSpeed, setExecutionSpeed] = useState<ExecutionSpeed>('normal');
  const [activePresetKey, setActivePresetKey] = useState<string>('gloves');
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState<boolean>(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const [hospitalSettings, setHospitalSettings] = useState<HospitalSettings>({
    name: 'CityCare General Hospital',
    code: 'CCGH-METRO-01',
    department: 'Central Supply & Clinical Logistics',
    procurementManager: 'Dr. Sarah Jenkins',
    environment: 'Demo Mode',
    network: 'Algorand TestNet',
    paymentProtocol: 'x402',
    agentStatus: 'Online',
    safetyThresholdDays: 5,
    autoApprovalThresholdInr: 1000,
  });

  // Load real payments from backend on mount
  useEffect(() => {
    async function loadInitialPayments() {
      try {
        const { getPayments } = await import('@/lib/api');
        const list = await getPayments();
        if (list && list.length > 0) {
          setPayments(list);
        } else {
          setPayments(mockPayments as any);
        }
      } catch {
        setPayments(mockPayments as any);
      }
    }
    loadInitialPayments();
  }, []);

  const [agentState, setAgentState] = useState<AgentRunState>({
    runId: 'run-98421',
    status: 'idle',
    currentStepIndex: 0,
    steps: initialWorkflowSteps,
    events: [],
    targetItem: {
      name: clinicalPresets.gloves.name,
      category: clinicalPresets.gloves.category,
      currentStock: clinicalPresets.gloves.currentStock,
      shortageUnits: clinicalPresets.gloves.shortageUnits,
      recommendedQty: clinicalPresets.gloves.recommendedQty,
    },
    paymentRequired: {
      amountUsd: 0.02,
      service: 'Autonomous Agent Tier-1 Supplier Intelligence',
      protocol: 'x402',
      network: 'Algorand TestNet',
      isSimulated: false,
    },
    recommendationResult: {
      supplierName: clinicalPresets.gloves.supplierName,
      supplierScore: clinicalPresets.gloves.supplierScore,
      itemName: clinicalPresets.gloves.name,
      quantity: clinicalPresets.gloves.recommendedQty,
      unitPrice: clinicalPresets.gloves.unitPrice,
      totalCost: clinicalPresets.gloves.totalCost,
      deliveryDays: clinicalPresets.gloves.deliveryDays,
      reliability: clinicalPresets.gloves.reliability,
      estimatedSavings: clinicalPresets.gloves.estimatedSavings,
      rationale: clinicalPresets.gloves.rationale,
    },
  });

  const addToast = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addInventoryItem = async (input: NewInventoryItemInput): Promise<InventoryItem> => {
    const daysRemaining = Number((input.currentStock / (input.dailyUsage || 1)).toFixed(1));
    const predictedDemand7d = input.dailyUsage * 7;
    const shortage = Math.max(0, predictedDemand7d - input.currentStock);
    
    let status: 'Critical' | 'Warning' | 'Healthy' = 'Healthy';
    if (daysRemaining <= 4) status = 'Critical';
    else if (daysRemaining <= 6) status = 'Warning';

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: input.name,
      category: input.category,
      currentStock: Number(input.currentStock),
      dailyUsage: Number(input.dailyUsage),
      reorderPoint: Number(input.reorderPoint),
      daysRemaining,
      predictedDemand7d,
      expectedShortage: shortage,
      unit: input.unit || 'units',
      unitCost: input.unitCost || 12.00,
      status,
      lastUpdated: 'Just now',
      historicalDemand: [
        { day: 'Today', stock: input.currentStock, forecast: input.dailyUsage },
        { day: 'Day 1', stock: Math.max(0, input.currentStock - input.dailyUsage), forecast: input.dailyUsage },
        { day: 'Day 2', stock: Math.max(0, input.currentStock - input.dailyUsage * 2), forecast: input.dailyUsage },
        { day: 'Day 3', stock: Math.max(0, input.currentStock - input.dailyUsage * 3), forecast: input.dailyUsage },
        { day: 'Day 4', stock: Math.max(0, input.currentStock - input.dailyUsage * 4), forecast: input.dailyUsage },
        { day: 'Day 5', stock: Math.max(0, input.currentStock - input.dailyUsage * 5), forecast: input.dailyUsage },
        { day: 'Day 6', stock: Math.max(0, input.currentStock - input.dailyUsage * 6), forecast: input.dailyUsage },
        { day: 'Day 7', stock: Math.max(0, input.currentStock - input.dailyUsage * 7), forecast: input.dailyUsage },
      ],
    };

    setInventory((prev) => [newItem, ...prev]);
    
    const act: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'Inventory Item Added',
      description: `Added ${newItem.name} (${newItem.currentStock} ${newItem.unit}) to hospital inventory.`,
      category: 'inventory',
      status: 'info',
      iconName: 'PackagePlus',
      badgeText: newItem.category,
    };
    setActivities((prev) => [act, ...prev]);
    addToast('Inventory item added.', 'success');
    return newItem;
  };

  const createProcurementOrder = async (req: Partial<ProcurementRequest>): Promise<ProcurementRequest> => {
    const newReq: ProcurementRequest = {
      id: `req-${Date.now()}`,
      requestId: `REQ-00${procurements.length + 1}`,
      itemId: req.itemId || 'inv-n95-masks',
      itemName: req.itemName || 'N95 Respirator Masks',
      category: req.category || 'Protective Equipment',
      quantity: req.quantity || 200,
      unit: req.unit || 'boxes (20/bx)',
      unitPrice: req.unitPrice || 9.50,
      estimatedCost: req.estimatedCost || 1900,
      supplierId: req.supplierId || 'sup-medisupply',
      supplierName: req.supplierName || 'MediSupply Healthcare Solutions',
      deliveryDays: req.deliveryDays || 2,
      supplierScore: req.supplierScore || 94.6,
      status: 'Approved',
      createdAt: 'Just now',
      approvedAt: 'Just now',
      approvedBy: hospitalSettings.procurementManager,
      notes: req.notes || 'Autonomous AI procurement recommendation authorized.',
      timeline: [
        { step: 'Recommendation Generated', status: 'completed', timestamp: 'Just now', actor: 'MedMatch Agent' },
        { step: 'Human Approval', status: 'completed', timestamp: 'Just now', actor: hospitalSettings.procurementManager },
        { step: 'Procurement Created', status: 'completed', timestamp: 'Just now', actor: 'MedMatch ERP Adapter' },
        { step: 'Supplier Confirmation', status: 'demo_state', timestamp: 'Pending Sync', notes: 'DEMO STATE: Simulated supplier dispatch acknowledgement' },
        { step: 'Completed', status: 'pending', timestamp: 'Expected in 2 Days' },
      ],
    };

    setProcurements((prev) => [newReq, ...prev]);
    return newReq;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateHospitalSettings = (settings: Partial<HospitalSettings>) => {
    setHospitalSettings((prev) => ({ ...prev, ...settings }));
    addToast('Settings updated.', 'info');
  };

  // -------------------------------------------------------------
  // AGENT SEQUENTIAL WORKFLOW RUNNER (10-15s Interactive demo)
  // -------------------------------------------------------------

  const getDelay = (baseMs: number) => {
    if (executionSpeed === 'turbo') return Math.max(80, Math.round(baseMs * 0.1));
    if (executionSpeed === 'fast') return Math.round(baseMs * 0.35);
    return baseMs;
  };

  const selectTargetItemPreset = (presetKey: string) => {
    const preset = clinicalPresets[presetKey] || clinicalPresets.n95;
    clearAllAgentTimeouts();
    setActivePresetKey(presetKey);

    setAgentState((prev) => ({
      ...prev,
      status: 'idle',
      currentStepIndex: 0,
      steps: initialWorkflowSteps.map((s) => ({ ...s, status: 'pending' })),
      events: [],
      procurementRequestId: undefined,
      targetItem: {
        name: preset.name,
        category: preset.category,
        currentStock: preset.currentStock,
        shortageUnits: preset.shortageUnits,
        recommendedQty: preset.recommendedQty,
      },
      recommendationResult: {
        supplierName: preset.supplierName,
        supplierScore: preset.supplierScore,
        itemName: preset.name,
        quantity: preset.recommendedQty,
        unitPrice: preset.unitPrice,
        totalCost: preset.totalCost,
        deliveryDays: preset.deliveryDays,
        reliability: preset.reliability,
        estimatedSavings: preset.estimatedSavings,
        rationale: preset.rationale,
      },
    }));

    addToast(`Target item set to ${preset.name}.`, 'info');
  };

  const clearAllAgentTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const resetAgentRun = () => {
    clearAllAgentTimeouts();
    const preset = clinicalPresets[activePresetKey] || clinicalPresets.n95;
    setAgentState((prev) => ({
      ...prev,
      status: 'idle',
      currentStepIndex: 0,
      steps: initialWorkflowSteps.map((s) => ({ ...s, status: 'pending' })),
      events: [],
      procurementRequestId: undefined,
      targetItem: {
        name: preset.name,
        category: preset.category,
        currentStock: preset.currentStock,
        shortageUnits: preset.shortageUnits,
        recommendedQty: preset.recommendedQty,
      },
      recommendationResult: {
        supplierName: preset.supplierName,
        supplierScore: preset.supplierScore,
        itemName: preset.name,
        quantity: preset.recommendedQty,
        unitPrice: preset.unitPrice,
        totalCost: preset.totalCost,
        deliveryDays: preset.deliveryDays,
        reliability: preset.reliability,
        estimatedSavings: preset.estimatedSavings,
        rationale: preset.rationale,
      },
    }));
  };

  const addAgentEvent = (title: string, detail: string, type: 'info' | 'success' | 'warning' | 'payment' | 'recommendation', stepId: number) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEvent: AgentLiveEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: timeStr,
      stepId,
      title,
      detail,
      type,
    };
    setAgentState((prev) => ({
      ...prev,
      events: [newEvent, ...prev.events],
    }));
    return newEvent;
  };

  const startAgentRun = () => {
    clearAllAgentTimeouts();
    const preset = clinicalPresets[activePresetKey] || clinicalPresets.n95;
    addToast(`Agent started (${executionSpeed.toUpperCase()} mode).`, 'info');
    
    // Reset steps to pending and set run status
    const resetSteps: AgentWorkflowStep[] = initialWorkflowSteps.map((s) => ({
      ...s,
      status: 'pending',
    }));

    setAgentState((prev) => ({
      ...prev,
      status: 'running',
      currentStepIndex: 0,
      steps: resetSteps,
      startedAt: new Date().toLocaleTimeString(),
      events: [],
    }));

    // Trigger backend autonomous agent execution asynchronously
    runAgent(preset.key === 'n95' ? 'inv-n95-masks-001' : preset.key).catch(() => {});

    // STEP 1: Inventory Analysis
    const t1 = setTimeout(() => {
      setAgentState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[0] = { ...nextSteps[0], status: 'running' };
        return { ...prev, steps: nextSteps, currentStepIndex: 0 };
      });
      addAgentEvent('Analyzing inventory...', `Auditing ${preset.category} & central clinical consumables inventory.`, 'info', 1);
    }, getDelay(200));
    timeoutsRef.current.push(t1);

    const t2 = setTimeout(() => {
      setAgentState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[0] = { ...nextSteps[0], status: 'completed' };
        nextSteps[1] = { ...nextSteps[1], status: 'running' };
        return { ...prev, steps: nextSteps, currentStepIndex: 1 };
      });
      addAgentEvent('✓ Inventory analysis completed', `Processed SKUs. Identified ${preset.currentStock} units of ${preset.name} remaining.`, 'success', 1);
      addToast('Inventory analyzed.', 'info');

      // STEP 2: Demand Forecast
      addAgentEvent('Generating demand forecast...', `Evaluating 7-day trailing consumption curve (${preset.dailyUsage} units/day).`, 'info', 2);
    }, getDelay(1800));
    timeoutsRef.current.push(t2);

    const t3 = setTimeout(() => {
      setAgentState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[1] = { ...nextSteps[1], status: 'completed' };
        nextSteps[2] = { ...nextSteps[2], status: 'running' };
        return { ...prev, steps: nextSteps, currentStepIndex: 2 };
      });
      addAgentEvent('✓ Forecast generated', `7-day forward requirement: ${preset.dailyUsage * 7} units needed.`, 'success', 2);

      // STEP 3: Shortage Detection
      addAgentEvent('Checking supply thresholds...', 'Evaluating safety buffer vs stock depletion timeline.', 'info', 3);
    }, getDelay(3600));
    timeoutsRef.current.push(t3);

    const t4 = setTimeout(() => {
      const daysLeft = (preset.currentStock / (preset.dailyUsage || 1)).toFixed(1);
      setAgentState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[2] = { ...nextSteps[2], status: 'completed' };
        nextSteps[3] = { ...nextSteps[3], status: 'running' };
        return { ...prev, steps: nextSteps, currentStepIndex: 3 };
      });
      addAgentEvent(`⚠ ${preset.name} shortage detected`, `Projected ${preset.shortageUnits} units stockout in ${daysLeft} days (below safety buffer).`, 'warning', 3);
      addToast('Shortage detected.', 'warning');

      // STEP 4: Supplier Intelligence
      addAgentEvent('Requesting supplier intelligence...', 'Querying verified supplier databases for immediate dispatch availability.', 'info', 4);
    }, getDelay(5400));
    timeoutsRef.current.push(t4);

    const t5 = setTimeout(async () => {
      try {
        const { requestPayment } = await import('@/lib/api');
        const req = await requestPayment({
          amount: 0.02,
          asset: 'USDC',
          currency: 'USD',
          purpose: 'Autonomous Agent Tier-1 Supplier Intelligence Oracle Fee',
          resource: '/api/paid/supplier-intelligence',
          runId: `run-${Date.now()}`
        });

        if (req && req.paymentId) {
          setCurrentPayment({
            id: req.paymentId,
            paymentId: req.paymentId,
            service: 'Tier-1 Supplier Intelligence Oracle',
            protocol: 'x402',
            network: 'algorand-testnet',
            amount: 0.02,
            amountUsd: 0.02,
            currency: 'USD',
            status: 'PAYMENT_REQUIRED',
            receiverAddress: req.payTo,
            resource: '/api/paid/supplier-intelligence',
            paymentRequirements: req
          });
        }
      } catch (err) {
        console.warn('Failed to pre-create payment requirement', err);
      }

      setAgentState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[3] = { ...nextSteps[3], status: 'completed' };
        nextSteps[4] = { ...nextSteps[4], status: 'waiting_action' };
        return {
          ...prev,
          status: 'waiting_payment',
          steps: nextSteps,
          currentStepIndex: 4,
        };
      });
      addAgentEvent('Micropayment authorization required', 'Autonomous micro-settlement of $0.02 USD required for real-time tier-1 intelligence.', 'payment', 5);
      addToast('Supplier intelligence requested.', 'info');
      setIsPaymentModalOpen(true);
    }, getDelay(7200));
    timeoutsRef.current.push(t5);
  };

  const continuePaymentFlow = async () => {
    setIsPaymentModalOpen(false);
    clearAllAgentTimeouts();
    const preset = clinicalPresets[activePresetKey] || clinicalPresets.n95;
    
    // Set step 5 to running
    setAgentState((prev) => {
      const nextSteps = [...prev.steps];
      nextSteps[4] = { ...nextSteps[4], status: 'running' };
      return { ...prev, status: 'running', steps: nextSteps, currentStepIndex: 4 };
    });

    addAgentEvent('Authorizing Algorand micro-settlement...', 'Authorizing $0.02 micropayment payload to supplier gateway...', 'payment', 5);

    // Refresh payments list from backend
    try {
      const { getPayments } = await import('@/lib/api');
      const list = await getPayments();
      if (list && list.length > 0) {
        setPayments(list);
        if (list[0]) {
          setCurrentPayment(list[0]);
        }
      }
    } catch {
      // ignore
    }

    const txIdDisplay = currentPayment?.transactionId || 'Awaiting block confirmation';

    // Update steps: Step 5 completed -> Step 6 (Algorand Settlement) running
    setAgentState((prev) => {
      const nextSteps = [...prev.steps];
      nextSteps[4] = { ...nextSteps[4], status: 'completed' };
      nextSteps[5] = { ...nextSteps[5], status: 'running' };
      return { ...prev, steps: nextSteps, currentStepIndex: 5 };
    });

    addAgentEvent('✓ Micropayment complete', `TxID: ${txIdDisplay} (Algorand TestNet)`, 'payment', 5);
    addToast('Payment authorized and verified.', 'success');

    // STEP 6: Algorand Settlement
    const t6 = setTimeout(() => {
      setAgentState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[5] = { ...nextSteps[5], status: 'completed' };
        nextSteps[6] = { ...nextSteps[6], status: 'running' };
        return { ...prev, steps: nextSteps, currentStepIndex: 6 };
      });
      addAgentEvent('✓ Supplier intelligence unlocked', `Settlement confirmed on Algorand TestNet.`, 'success', 6);

      // STEP 7: Supplier Ranking
      addAgentEvent('Ranking suppliers...', 'Weighing Price (40%), Delivery Lead Time (30%), Reliability SLA (30%)...', 'info', 7);
    }, getDelay(1800));
    timeoutsRef.current.push(t6);

    timeoutsRef.current.push(t6);

    const t7 = setTimeout(() => {
      setAgentState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[6] = { ...nextSteps[6], status: 'completed' };
        nextSteps[7] = { ...nextSteps[7], status: 'running' };
        return { ...prev, steps: nextSteps, currentStepIndex: 7 };
      });
      addAgentEvent('✓ Supplier ranking completed', `${preset.supplierName} ranked #1 (Score: ${preset.supplierScore} / 100) due to ${preset.deliveryDays}-day lead time.`, 'success', 7);
      addToast('Supplier ranking completed.', 'info');

      // STEP 8: Recommendation
      addAgentEvent('Generating recommendation...', `Synthesizing procurement batch: ${preset.recommendedQty} units ${preset.name} @ ₹${preset.unitPrice.toFixed(2)} (₹${preset.totalCost}).`, 'info', 8);
    }, getDelay(3600));
    timeoutsRef.current.push(t7);

    const t8 = setTimeout(() => {
      setAgentState((prev) => {
        const nextSteps = [...prev.steps];
        nextSteps[7] = { ...nextSteps[7], status: 'completed' };
        nextSteps[8] = { ...nextSteps[8], status: 'waiting_action' };
        return {
          ...prev,
          status: 'waiting_approval',
          steps: nextSteps,
          currentStepIndex: 8,
        };
      });
      addAgentEvent('✓ Recommendation ready', `Optimal match: ${preset.supplierName} (₹${preset.totalCost} total, ₹${preset.estimatedSavings} savings). Awaiting human sign-off.`, 'recommendation', 8);
      addToast('Recommendation generated.', 'success');
      setIsApprovalModalOpen(true);
    }, getDelay(5400));
    timeoutsRef.current.push(t8);
  };

  const confirmApprovalFlow = async () => {
    setIsApprovalModalOpen(false);
    const preset = clinicalPresets[activePresetKey] || clinicalPresets.n95;

    // Complete Step 9
    setAgentState((prev) => {
      const nextSteps = [...prev.steps];
      nextSteps[8] = { ...nextSteps[8], status: 'completed' };
      return {
        ...prev,
        status: 'completed',
        steps: nextSteps,
        currentStepIndex: 8,
        completedAt: new Date().toLocaleTimeString(),
      };
    });

    // Create procurement request
    const newReq = await createProcurementOrder({
      itemName: preset.name,
      itemId: `inv-${preset.key}`,
      category: preset.category as any,
      quantity: preset.recommendedQty,
      unit: 'units',
      unitPrice: preset.unitPrice,
      estimatedCost: preset.totalCost,
      supplierId: `sup-${preset.key}`,
      supplierName: preset.supplierName,
      deliveryDays: preset.deliveryDays,
      supplierScore: preset.supplierScore,
      notes: 'Autonomous recommendation approved by procurement manager.',
    });

    setAgentState((prev) => ({
      ...prev,
      procurementRequestId: newReq.requestId,
    }));

    addAgentEvent('✓ Human approval recorded', `Procurement Request ${newReq.requestId} created for ${preset.supplierName} (₹${preset.totalCost}).`, 'success', 9);
    
    // Add to activity stream
    const act: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: 'Procurement Request Created',
      description: `${newReq.requestId} created for ${preset.recommendedQty} units ${preset.name} from ${preset.supplierName} (₹${preset.totalCost}).`,
      category: 'procurement',
      status: 'success',
      iconName: 'ClipboardCheck',
      relatedId: newReq.requestId,
      badgeText: 'Approved',
    };
    setActivities((prev) => [act, ...prev]);

    addToast('Procurement request created.', 'success');
  };

  // Keyboard shortcut listener for Global Search palette ('/' or 'Ctrl+K')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DemoContext.Provider
      value={{
        inventory,
        addInventoryItem,
        forecasts,
        supplyRisks,
        suppliers,
        supplierMatrix,
        procurements,
        createProcurementOrder,
        payments,
        activities,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        addToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
        hospitalSettings,
        updateHospitalSettings,
        agentState,
        executionSpeed,
        setExecutionSpeed,
        activePresetKey,
        selectTargetItemPreset,
        autoApprovalEnabled,
        setAutoApprovalEnabled,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isApprovalModalOpen,
        setIsApprovalModalOpen,
        currentPayment,
        setCurrentPayment,
        startAgentRun,
        continuePaymentFlow,
        confirmApprovalFlow,
        resetAgentRun,
      }}
    >

      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
