import { ProcurementService } from '../src/services/procurement.service';
import { RecommendationRecord } from '../src/types/procurement.types';

// Mock Repositories
const recommendationStore = new Map<string, RecommendationRecord>();
const procurementStore = new Map<string, any>();

jest.mock('../src/repositories/recommendation.repository', () => ({
  RecommendationRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn().mockImplementation(async (id) => recommendationStore.get(id) || null),
    updateStatus: jest.fn().mockImplementation(async (id, status) => {
      const existing = recommendationStore.get(id);
      if (!existing) return null;
      const updated = { ...existing, status };
      recommendationStore.set(id, updated);
      return updated;
    })
  }))
}));

jest.mock('../src/repositories/procurement.repository', () => ({
  ProcurementRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockImplementation(async (req) => {
      procurementStore.set(req.id, req);
      return req;
    }),
    findById: jest.fn().mockImplementation(async (hospitalId, id) => {
      const item = procurementStore.get(id);
      if (item && item.hospitalId === hospitalId) return item;
      return null;
    }),
    findByHospital: jest.fn().mockImplementation(async (hospitalId) => {
      return Array.from(procurementStore.values()).filter((p) => p.hospitalId === hospitalId);
    }),
    updateStatus: jest.fn().mockImplementation(async (hospitalId, id, status, approvedBy) => {
      const item = procurementStore.get(id);
      if (!item || item.hospitalId !== hospitalId) return null;
      const updated = { ...item, status, approvedBy, approvedAt: new Date().toISOString() };
      procurementStore.set(id, updated);
      return updated;
    })
  }))
}));

jest.mock('../src/repositories/inventory.repository', () => ({
  InventoryRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn().mockResolvedValue({
      id: 'inv-n95-masks-001',
      name: 'N95 Masks',
      unit: 'boxes'
    })
  }))
}));

jest.mock('../src/repositories/supplier.repository', () => ({
  SupplierRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn().mockResolvedValue({
      id: 'supp-medisupply-001',
      name: 'MediSupply'
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

describe('Procurement Service - Human-in-the-Loop Governance', () => {
  const service = new ProcurementService();
  const hospitalId = 'hospital-citycare-001';
  const userId = 'user-test-01';

  beforeEach(() => {
    recommendationStore.clear();
    procurementStore.clear();

    // Setup initial recommendation
    const rec: RecommendationRecord = {
      id: 'rec-001',
      runId: 'run-001',
      hospitalId,
      inventoryId: 'inv-n95-masks-001',
      inventoryName: 'N95 Masks',
      supplierId: 'supp-medisupply-001',
      supplierName: 'MediSupply',
      quantity: 200,
      unitPrice: 9.5,
      estimatedCost: 1900,
      deliveryDays: 2,
      supplierScore: 94.6,
      estimatedSavings: 300,
      reasoning: 'MediSupply offers optimal balance of cost, delivery, and reliability.',
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    recommendationStore.set(rec.id, rec);
  });

  it('should create procurement request with PENDING_APPROVAL status (never auto-order)', async () => {
    const procurement = await service.createProcurement(hospitalId, userId, {
      recommendationId: 'rec-001',
      supplierId: 'supp-medisupply-001',
      inventoryId: 'inv-n95-masks-001',
      quantity: 200,
      estimatedCost: 1900
    });

    expect(procurement.status).toBe('PENDING_APPROVAL');
    expect(procurement.estimatedCost).toBe(1900);
    expect(procurement.supplierName).toBe('MediSupply');
  });

  it('should transition procurement to APPROVED only upon explicit human approval', async () => {
    const procurement = await service.createProcurement(hospitalId, userId, {
      recommendationId: 'rec-001',
      supplierId: 'supp-medisupply-001',
      inventoryId: 'inv-n95-masks-001',
      quantity: 200,
      estimatedCost: 1900
    });

    const approved = await service.approveProcurement(hospitalId, userId, procurement.id);
    expect(approved.status).toBe('APPROVED');
    expect(approved.approvedBy).toBe(userId);
    expect(approved.approvedAt).toBeDefined();

    // Verify linked recommendation is also marked APPROVED
    const updatedRec = recommendationStore.get('rec-001');
    expect(updatedRec?.status).toBe('APPROVED');
  });

  it('should cancel pending procurement request when requested', async () => {
    const procurement = await service.createProcurement(hospitalId, userId, {
      recommendationId: 'rec-001',
      supplierId: 'supp-medisupply-001',
      inventoryId: 'inv-n95-masks-001',
      quantity: 200,
      estimatedCost: 1900
    });

    const cancelled = await service.cancelProcurement(hospitalId, userId, procurement.id);
    expect(cancelled.status).toBe('CANCELLED');
  });
});
