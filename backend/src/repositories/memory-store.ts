import { InventoryItem, InventoryUsageRecord } from '../types/inventory.types';
import { Supplier } from '../types/supplier.types';
import { Hospital } from '../types/hospital.types';
import { ProcurementRequestRecord, RecommendationRecord } from '../types/procurement.types';
import { PaymentRecord } from '../types/payment.types';
import { AgentRunRecord, AgentStepRecord, AgentEventRecord } from '../types/agent.types';
import { ActivityRecord } from '../types/activity.types';
import { NotificationRecord } from '../types/notification.types';
import { UserProfile } from '../types/auth.types';
import { DataSourceRecord } from '../types/data-source.types';
import { inventorySeed, inventoryUsageSeed } from '../seed/inventory.seed';
import { suppliersSeed } from '../seed/suppliers.seed';
import { hospitalsSeed } from '../seed/hospitals.seed';
import { getCurrentIsoDate } from '../utils/dates';

export class MemoryStore {
  private static instance: MemoryStore;

  public hospitals: Map<string, Hospital> = new Map();
  public users: Map<string, UserProfile> = new Map();
  public inventory: Map<string, InventoryItem> = new Map();
  public inventoryUsage: Map<string, InventoryUsageRecord> = new Map();
  public suppliers: Map<string, Supplier> = new Map();
  public agentRuns: Map<string, AgentRunRecord> = new Map();
  public agentSteps: Map<string, AgentStepRecord> = new Map();
  public agentEvents: Map<string, AgentEventRecord> = new Map();
  public recommendations: Map<string, RecommendationRecord> = new Map();
  public procurements: Map<string, ProcurementRequestRecord> = new Map();
  public payments: Map<string, PaymentRecord> = new Map();
  public activities: Map<string, ActivityRecord> = new Map();
  public notifications: Map<string, NotificationRecord> = new Map();
  public dataSources: Map<string, DataSourceRecord> = new Map();

  private constructor() {
    this.seedDefaults();
  }

  public static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  public seedDefaults(): void {
    const now = getCurrentIsoDate();
    const hospital = hospitalsSeed[0]!;

    // Hospitals
    this.hospitals.set(hospital.id, { ...hospital });

    // Inventory
    inventorySeed.forEach((item) => this.inventory.set(item.id, { ...item }));
    inventoryUsageSeed.forEach((usage) => this.inventoryUsage.set(usage.id, { ...usage }));

    // Suppliers
    suppliersSeed.forEach((sup) => this.suppliers.set(sup.id, { ...sup }));

    // Public Healthcare Data Sources
    const initialDataSources: DataSourceRecord[] = [
      {
        id: 'ds-india-nhp-001',
        sourceName: 'Government of India — National Health Portal (NHP)',
        sourceUrl: 'https://data.gov.in/sector/health-and-family-welfare',
        datasetName: 'National Hospital Directory & Clinical Consumable Norms',
        description: 'Official Government of India public directory covering tertiary healthcare facilities, district hospitals, and standardized consumption benchmarks.',
        categories: ['Hospitals', 'Infrastructure', 'Norms'],
        coverage: 'Pan-India (28 States & 8 UTs)',
        recordCount: 28450,
        license: 'Open Government Data (OGD) India License',
        retrievedAt: now,
        lastUpdated: now,
        syncStatus: 'SYNCED',
        lastSyncMessage: 'Synchronized 28,450 facility benchmarks successfully.'
      },
      {
        id: 'ds-who-eml-002',
        sourceName: 'World Health Organization (WHO)',
        sourceUrl: 'https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02',
        datasetName: 'WHO Model List of Essential Medicines & Critical Medical Consumables (23rd List)',
        description: 'Standard international categorization, therapeutic tiers, and minimum safety reserve parameters for clinical supplies and life-saving pharmaceuticals.',
        categories: ['Pharmaceuticals', 'PPE', 'Critical Supplies'],
        coverage: 'Global Standard Healthcare Guidelines',
        recordCount: 502,
        license: 'CC BY-NC-SA 3.0 IGO',
        retrievedAt: now,
        lastUpdated: now,
        syncStatus: 'SYNCED',
        lastSyncMessage: 'All 502 essential therapeutic supply specifications verified.'
      },
      {
        id: 'ds-cdsco-india-003',
        sourceName: 'Central Drugs Standard Control Organization (CDSCO)',
        sourceUrl: 'https://cdsco.gov.in/opencms/opencms/en/Medical-Device-Diagnostics/',
        datasetName: 'Registered Medical Device & Surgical Consumable Vendors Directory',
        description: 'Verified manufacturing licenses, ISO 13485 accreditations, and regulatory compliance records for surgical equipment and PPE manufacturers.',
        categories: ['Medical Devices', 'PPE', 'Surgical'],
        coverage: 'National Regulatory Registry (India)',
        recordCount: 4210,
        license: 'Government Public Domain',
        retrievedAt: now,
        lastUpdated: now,
        syncStatus: 'SYNCED',
        lastSyncMessage: 'Regulatory compliance matrix updated for 4,210 verified vendors.'
      }
    ];

    initialDataSources.forEach((ds) => this.dataSources.set(ds.id, ds));

    // Initial procurement requests
    const initialProcurement: ProcurementRequestRecord = {
      id: 'REQ-001',
      hospitalId: hospital.id,
      userId: 'user-rachel-001',
      recommendationId: 'rec-n95-masks',
      inventoryId: 'inv-n95-masks-001',
      inventoryName: 'N95 Respirator Masks',
      supplierId: 'sup-medisupply-001',
      supplierName: 'MediSupply Healthcare Solutions',
      quantity: 200,
      estimatedCost: 1900,
      status: 'APPROVED',
      approvedBy: 'Dr. Rachel Reynolds (Procurement Manager)',
      approvedAt: now,
      createdAt: now,
      updatedAt: now
    };

    this.procurements.set(initialProcurement.id, initialProcurement);

    // No simulated/fake initial payments - payments are strictly database-backed

    // Initial activity items
    const initialActivities: ActivityRecord[] = [
      {
        id: 'act-001',
        hospitalId: hospital.id,
        userId: 'user-rachel-001',
        runId: 'run-initial',
        type: 'PROCUREMENT_APPROVED',
        message: 'Dr. Rachel Reynolds authorized 200 boxes of N95 Masks from MediSupply.',
        createdAt: now,
        metadata: { procurementId: 'REQ-001', amount: 1900 }
      },
      {
        id: 'act-002',
        hospitalId: hospital.id,
        userId: 'user-rachel-001',
        runId: 'run-initial',
        type: 'AGENT_COMPLETED',
        message: 'Evaluated inventory items, identified 1 critical risk, and synthesized procurement recommendation.',
        createdAt: now,
        metadata: { runId: 'run-initial' }
      },
      {
        id: 'act-003',
        hospitalId: hospital.id,
        userId: 'user-rachel-001',
        runId: 'run-initial',
        type: 'PAYMENT_EXECUTED',
        message: '$0.001 USD settlement confirmed on Algorand TestNet (TXN: ALGO-TXN-79421).',
        createdAt: now,
        metadata: { paymentId: 'PAY-001' }
      }
    ];

    initialActivities.forEach((act) => this.activities.set(act.id, act));

    // Initial notifications
    const initialNotifs: NotificationRecord[] = [
      {
        id: 'notif-001',
        hospitalId: hospital.id,
        userId: 'user-rachel-001',
        type: 'CRITICAL',
        title: 'Critical Supply Threshold: N95 Masks',
        message: 'Current stock of 120 boxes is below safety reorder threshold of 150 boxes (2.9 days remaining).',
        read: false,
        createdAt: now,
        metadata: { link: '/inventory' }
      },
      {
        id: 'notif-002',
        hospitalId: hospital.id,
        userId: 'user-rachel-001',
        type: 'SUCCESS',
        title: 'Procurement Recommendation Ready',
        message: 'Optimal procurement action synthesized for MediSupply Healthcare Solutions (200 units @ ₹9.50/unit).',
        read: false,
        createdAt: now,
        metadata: { link: '/recommendation' }
      }
    ];

    initialNotifs.forEach((notif) => this.notifications.set(notif.id, notif));
  }
}
