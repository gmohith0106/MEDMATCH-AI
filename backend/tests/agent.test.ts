import { AgentService } from '../src/services/agent.service';
import { InventoryItem } from '../src/types/inventory.types';
import { Supplier } from '../src/types/supplier.types';
import { ALGORAND_TESTNET_CAIP2 } from '../src/config/constants';

// In-memory repositories store for agent test
const runStore = new Map<string, any>();
const stepStore: any[] = [];
const eventStore: any[] = [];
const paymentStore = new Map<string, any>();
const recommendationStore = new Map<string, any>();

jest.mock('../src/repositories/agent.repository', () => ({
  AgentRepository: jest.fn().mockImplementation(() => ({
    createRun: jest.fn().mockImplementation(async (run) => {
      runStore.set(run.id, run);
      return run;
    }),
    findRunById: jest.fn().mockImplementation(async (id) => runStore.get(id) || null),
    updateRun: jest.fn().mockImplementation(async (id, updates) => {
      const existing = runStore.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      runStore.set(id, updated);
      return updated;
    }),
    saveStep: jest.fn().mockImplementation(async (step) => {
      stepStore.push(step);
      return step;
    }),
    findStepsByRun: jest.fn().mockImplementation(async (runId) => {
      return stepStore.filter((s) => s.runId === runId);
    }),
    createEvent: jest.fn().mockImplementation(async (evt) => {
      eventStore.push(evt);
      return evt;
    }),
    findEventsByRun: jest.fn().mockImplementation(async (runId) => {
      return eventStore.filter((e) => e.runId === runId);
    }),
    saveForecast: jest.fn().mockResolvedValue({}),
    saveShortage: jest.fn().mockResolvedValue({})
  }))
}));

jest.mock('../src/repositories/inventory.repository', () => {
  const sampleItems: InventoryItem[] = [
    {
      id: 'inv-n95-masks-001',
      hospitalId: 'hospital-citycare-001',
      name: 'N95 Masks',
      category: 'PPE',
      currentStock: 120,
      dailyUsage: 42,
      reorderPoint: 150,
      unit: 'boxes',
      status: 'CRITICAL',
      daysRemaining: 2.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return {
    InventoryRepository: jest.fn().mockImplementation(() => ({
      findByHospital: jest.fn().mockResolvedValue({
        items: sampleItems,
        total: 1,
        page: 1,
        limit: 10
      }),
      findById: jest.fn().mockImplementation(async (_hId, id) => {
        return sampleItems.find((i) => i.id === id) || null;
      })
    }))
  };
});

jest.mock('../src/repositories/supplier.repository', () => {
  const sampleSuppliers: Supplier[] = [
    {
      id: 'supp-medisupply-001',
      name: 'MediSupply',
      category: 'Medical Supplies',
      location: 'Bengaluru',
      pricePerUnit: 9.5,
      deliveryDays: 2,
      reliabilityScore: 98,
      availabilityScore: 96,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'supp-healthsource-002',
      name: 'HealthSource',
      category: 'Medical Supplies',
      location: 'Hyderabad',
      pricePerUnit: 10.2,
      deliveryDays: 3,
      reliabilityScore: 95,
      availabilityScore: 94,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return {
    SupplierRepository: jest.fn().mockImplementation(() => ({
      findAll: jest.fn().mockResolvedValue(sampleSuppliers),
      findByCategory: jest.fn().mockResolvedValue(sampleSuppliers),
      saveAnalysis: jest.fn().mockResolvedValue({})
    }))
  };
});

jest.mock('../src/repositories/payment.repository', () => ({
  PaymentRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockImplementation(async (p) => {
      paymentStore.set(p.id, p);
      return p;
    }),
    findById: jest.fn().mockImplementation(async (id) => paymentStore.get(id) || null),
    update: jest.fn().mockImplementation(async (id, updates) => {
      const existing = paymentStore.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      paymentStore.set(id, updated);
      return updated;
    }),
    findByRunId: jest.fn().mockImplementation(async (runId) => {
      return Array.from(paymentStore.values()).find((p) => p.runId === runId) || null;
    }),
    findByHospital: jest.fn().mockImplementation(async (hospitalId) => {
      return Array.from(paymentStore.values()).filter((p) => p.hospitalId === hospitalId);
    })
  }))
}));

jest.mock('../src/repositories/recommendation.repository', () => ({
  RecommendationRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockImplementation(async (rec) => {
      recommendationStore.set(rec.id, rec);
      return rec;
    }),
    findByRunId: jest.fn().mockImplementation(async (runId) => {
      return Array.from(recommendationStore.values()).find((r) => r.runId === runId) || null;
    })
  }))
}));

jest.mock('../src/repositories/activity.repository', () => ({
  ActivityRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({})
  }))
}));

jest.mock('../src/repositories/notification.repository', () => ({
  NotificationRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({})
  }))
}));

import { X402BuyerClientService } from '../src/services/payments/buyer-client.service';

describe('Autonomous Procurement Agent - 9-Step End-to-End Workflow', () => {
  const agentService = new AgentService();
  const hospitalId = 'hospital-citycare-001';
  const userId = 'user-test-agent';

  beforeEach(() => {
    runStore.clear();
    stepStore.length = 0;
    eventStore.length = 0;
    paymentStore.clear();
    recommendationStore.clear();

    const validTxId = 'VOGEUKZNJQYTY7PUPWZEVRR6XG4U2R2U2K7V3E6VNZ3575CZABC4';
    jest.spyOn(X402BuyerClientService.prototype, 'purchaseSupplierIntelligence').mockResolvedValue({
      success: true,
      statusCode: 200,
      data: {
        premiumData: {
          exclusiveDiscounts: true,
          liveInventoryVerification: true
        }
      },
      paymentRecord: {
        id: `pay_x402_mock_unit`,
        runId: 'run-mock',
        hospitalId,
        userId,
        amount: 0.02,
        asset: 'USDC',
        currency: 'USD',
        protocol: 'x402',
        network: ALGORAND_TESTNET_CAIP2,
        status: 'PAYMENT_SETTLED',
        provider: 'x402 / GoPlausible Facilitator',
        transactionId: validTxId,
        verified: true,
        resource: '/api/paid/supplier-intelligence',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      transactionId: validTxId,
      explorerUrl: `https://lora.algokit.io/testnet/transaction/${validTxId}`
    });
  });


  it('should successfully execute the complete 9-step workflow', async () => {
    const result = await agentService.executeAgentRun(hospitalId, userId, 'inv-n95-masks-001');

    // 1. Verify Run Status
    expect(result.run.status).toBe('COMPLETED');
    expect(result.run.currentStep).toBe('HUMAN_APPROVAL');

    // 2. Verify all 9 Steps executed
    expect(result.steps.length).toBeGreaterThanOrEqual(9);
    const stepTypes = result.steps.map((s) => s.type);
    expect(stepTypes).toContain('INVENTORY_ANALYSIS');
    expect(stepTypes).toContain('DEMAND_FORECAST');
    expect(stepTypes).toContain('SHORTAGE_DETECTION');
    expect(stepTypes).toContain('SUPPLIER_INTELLIGENCE');
    expect(stepTypes).toContain('X402_PAYMENT');
    expect(stepTypes).toContain('ALGORAND_SETTLEMENT');
    expect(stepTypes).toContain('SUPPLIER_RANKING');
    expect(stepTypes).toContain('RECOMMENDATION');
    expect(stepTypes).toContain('HUMAN_APPROVAL');

    // 3. Verify Payment
    expect(result.payment).toBeDefined();
    expect(result.payment?.amount).toBe(0.02);
    expect(result.payment?.protocol).toBe('x402');
    expect(result.payment?.network).toBe(ALGORAND_TESTNET_CAIP2);
    expect(result.payment?.status).toBeDefined();

    // 4. Verify Recommendation generated & awaiting human approval
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation?.supplierName).toBe('MediSupply');
    expect(result.recommendation?.status).toBe('PENDING_APPROVAL');
    expect(result.recommendation?.estimatedCost).toBeGreaterThan(0);

    // 5. Verify live events emitted
    expect(result.events.length).toBeGreaterThan(5);
  });
});
