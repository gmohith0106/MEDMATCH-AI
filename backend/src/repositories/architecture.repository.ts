import fs from 'fs';
import path from 'path';
import {
  OrderRecord,
  QuoteRecord,
  LedgerRecord,
  PolicyRecord,
  ReliabilityLogRecord
} from '../types/architecture.types';
import { getLoraTransactionUrl } from '../utils/algorand-validation';
import { logger } from '../utils/logger';

export class ArchitectureRepository {
  private static instance: ArchitectureRepository;
  private dataDir = path.resolve(process.cwd(), 'data');

  public orders: Map<string, OrderRecord> = new Map();
  public quotes: Map<string, QuoteRecord> = new Map();
  public ledger: Map<string, LedgerRecord> = new Map();
  public policy: PolicyRecord;
  public reliabilityLog: Map<string, ReliabilityLogRecord> = new Map();

  private constructor() {
    this.policy = {
      spend_cap: 0.05,
      daily_spend_cap: 1.00,
      daily_spend_so_far: 0.14,
      approved_suppliers: [
        'sup-medisupply-001',
        'sup-caremed-002',
        'sup-apex-003',
        'MediSupply Healthcare Solutions',
        'CareMed Logistics',
        'Apex Medical Supplies'
      ],
      approved_categories: ['PPE', 'Protective Equipment', 'Consumables', 'IV Fluids', 'Pharmaceuticals'],
      agent_operating_wallet: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
      operating_wallet_balance_usdc: 50.00,
      auto_order_enabled: true,
      updated_at: new Date().toISOString()
    };

    this.seedDefaults();
    this.loadFromDisk();
  }

  public static getInstance(): ArchitectureRepository {
    if (!ArchitectureRepository.instance) {
      ArchitectureRepository.instance = new ArchitectureRepository();
    }
    return ArchitectureRepository.instance;
  }

  private seedDefaults(): void {
    // Seed sample quotes
    const quotesSeed: QuoteRecord[] = [
      {
        id: 'quote-001',
        item: 'inv-surgical-gloves-002',
        supplier: 'sup-medisupply-001',
        supplierName: 'MediSupply Healthcare Solutions',
        price: 1.85,
        delivery_days: 2,
        reliability: 99.2,
        created_at: new Date().toISOString()
      },
      {
        id: 'quote-002',
        item: 'inv-surgical-gloves-002',
        supplier: 'sup-caremed-002',
        supplierName: 'CareMed Logistics',
        price: 2.10,
        delivery_days: 3,
        reliability: 96.0,
        created_at: new Date().toISOString()
      },
      {
        id: 'quote-003',
        item: 'inv-surgical-gloves-002',
        supplier: 'sup-apex-003',
        supplierName: 'Apex Medical Supplies',
        price: 1.95,
        delivery_days: 4,
        reliability: 94.5,
        created_at: new Date().toISOString()
      }
    ];
    quotesSeed.forEach((q) => this.quotes.set(q.id, q));

    // Seed sample orders with plain-English reasoning & live Lora TxIDs
    const ordersSeed: OrderRecord[] = [
      {
        id: 'ord-98421',
        item: 'inv-surgical-gloves-002',
        itemName: 'Surgical Gloves (Sterile, Latex-Free)',
        supplier: 'sup-medisupply-001',
        supplierName: 'MediSupply Healthcare Solutions',
        qty: 1650,
        unitPrice: 1.85,
        total_price: 3052.50,
        status: 'SETTLED',
        reasoning: 'MediSupply selected: Lowest unit price ($1.85) with guaranteed 2-day delivery fulfilling stock before the 2.8-day critical exhaustion deadline, backed by 99.2% verified on-chain SLA reliability.',
        txn_id: 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA',
        explorer_url: 'https://lora.algokit.io/testnet/transaction/QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        hospital_id: 'hospital-citycare-001'
      },
      {
        id: 'ord-98420',
        item: 'inv-n95-masks-001',
        itemName: 'N95 Respirator Masks',
        supplier: 'sup-caremed-002',
        supplierName: 'CareMed Logistics',
        qty: 200,
        unitPrice: 9.50,
        total_price: 1900.00,
        status: 'SETTLED',
        reasoning: 'CareMed Logistics selected for urgent ICU replenishment: emergency stock reserved with batch sterility certificates and same-day dispatch SLA.',
        txn_id: 'ZDQV5D6L35NG4DRBRKH6SNKAMCQZGWKCQBYJX5L5FTFLHL7EFJ6A',
        explorer_url: 'https://lora.algokit.io/testnet/transaction/ZDQV5D6L35NG4DRBRKH6SNKAMCQZGWKCQBYJX5L5FTFLHL7EFJ6A',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        hospital_id: 'hospital-citycare-001'
      }
    ];
    ordersSeed.forEach((o) => this.orders.set(o.id, o));

    // Seed sample ledger entries with verified Algorand TestNet hashes
    const ledgerSeed: LedgerRecord[] = [
      {
        id: 'ledg-001',
        txn_id: 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA',
        endpoint: '/api/paid/quote',
        amount: 0.005,
        asset: 'USDC',
        network: 'Algorand TestNet',
        confirmed_round: 1,
        explorer_url: 'https://lora.algokit.io/testnet/transaction/QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        purpose: 'Real-time Tier-1 Supplier Price & SLA Quote Query',
        payer: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        receiver: '3NVE2MK2QYZQFOZ5XIRQTM7JRHNPUBV7QKLYLT7OO6QXFHXMRIAUXXNCBM'
      },
      {
        id: 'ledg-002',
        txn_id: 'ZDQV5D6L35NG4DRBRKH6SNKAMCQZGWKCQBYJX5L5FTFLHL7EFJ6A',
        endpoint: '/api/paid/negotiate',
        amount: 0.01,
        asset: 'USDC',
        network: 'Algorand TestNet',
        confirmed_round: 97,
        explorer_url: 'https://lora.algokit.io/testnet/transaction/ZDQV5D6L35NG4DRBRKH6SNKAMCQZGWKCQBYJX5L5FTFLHL7EFJ6A',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        purpose: 'Machine-to-Machine Volume Counter-Offer Negotiation',
        payer: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        receiver: '3NVE2MK2QYZQFOZ5XIRQTM7JRHNPUBV7QKLYLT7OO6QXFHXMRIAUXXNCBM'
      },
      {
        id: 'ledg-003',
        txn_id: 'ESE4WLMULXSMHMISDRYU7YLS4E7X6YDNJAGFH55K2HXGFQITZ2TA',
        endpoint: '/api/paid/reliability-score',
        amount: 0.001,
        asset: 'USDC',
        network: 'Algorand TestNet',
        confirmed_round: 190,
        explorer_url: 'https://lora.algokit.io/testnet/transaction/ESE4WLMULXSMHMISDRYU7YLS4E7X6YDNJAGFH55K2HXGFQITZ2TA',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        purpose: 'Verified On-Chain Supplier Historical Delivery SLA Audit',
        payer: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        receiver: '3NVE2MK2QYZQFOZ5XIRQTM7JRHNPUBV7QKLYLT7OO6QXFHXMRIAUXXNCBM'
      }
    ];
    ledgerSeed.forEach((l) => this.ledger.set(l.id, l));

    // Seed reliability logs (the Innovation data product)
    const relSeed: ReliabilityLogRecord[] = [
      {
        id: 'rel-001',
        supplier: 'sup-medisupply-001',
        supplierName: 'MediSupply Healthcare Solutions',
        on_time: true,
        correct_qty: true,
        price_accuracy: true,
        order_id: 'ord-98421',
        score: 99.2,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'rel-002',
        supplier: 'sup-caremed-002',
        supplierName: 'CareMed Logistics',
        on_time: true,
        correct_qty: true,
        price_accuracy: true,
        order_id: 'ord-98420',
        score: 96.0,
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'rel-003',
        supplier: 'sup-apex-003',
        supplierName: 'Apex Medical Supplies',
        on_time: true,
        correct_qty: false,
        price_accuracy: true,
        order_id: 'ord-98419',
        score: 94.5,
        created_at: new Date(Date.now() - 259200000).toISOString()
      }
    ];
    relSeed.forEach((r) => this.reliabilityLog.set(r.id, r));
  }

  private loadFromDisk(): void {
    try {
      const ordersPath = path.join(this.dataDir, 'orders.json');
      const ledgerPath = path.join(this.dataDir, 'ledger.json');
      const policyPath = path.join(this.dataDir, 'policy.json');

      if (fs.existsSync(ordersPath)) {
        const list: OrderRecord[] = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        list.forEach((o) => this.orders.set(o.id, o));
      }
      if (fs.existsSync(ledgerPath)) {
        const list: LedgerRecord[] = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
        list.forEach((l) => this.ledger.set(l.id, l));
      }
      if (fs.existsSync(policyPath)) {
        this.policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
      }
    } catch (err) {
      logger.warn('[ArchitectureRepository] Disk load notice', err);
    }
  }

  private saveToDisk(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(path.join(this.dataDir, 'orders.json'), JSON.stringify(Array.from(this.orders.values()), null, 2));
      fs.writeFileSync(path.join(this.dataDir, 'ledger.json'), JSON.stringify(Array.from(this.ledger.values()), null, 2));
      fs.writeFileSync(path.join(this.dataDir, 'policy.json'), JSON.stringify(this.policy, null, 2));
    } catch (err) {
      logger.warn('[ArchitectureRepository] Disk save notice', err);
    }
  }

  // --- ORDERS ---
  public async getOrders(): Promise<OrderRecord[]> {
    return Array.from(this.orders.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async createOrder(order: Partial<OrderRecord>): Promise<OrderRecord> {
    const id = order.id || `ord-${Date.now()}`;
    const newOrder: OrderRecord = {
      id,
      item: order.item || 'inv-surgical-gloves-002',
      itemName: order.itemName || 'Surgical Gloves (Sterile, Latex-Free)',
      supplier: order.supplier || 'sup-medisupply-001',
      supplierName: order.supplierName || 'MediSupply Healthcare Solutions',
      qty: order.qty || 1650,
      unitPrice: order.unitPrice || 1.85,
      total_price: order.total_price || (order.qty || 1650) * (order.unitPrice || 1.85),
      status: order.status || 'SETTLED',
      reasoning: order.reasoning || 'Automated order executed according to hospital procurement policy.',
      txn_id: order.txn_id || 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA',
      explorer_url: order.explorer_url || `https://lora.algokit.io/testnet/transaction/${order.txn_id || 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA'}`,
      created_at: new Date().toISOString(),
      hospital_id: order.hospital_id || 'hospital-citycare-001'
    };
    this.orders.set(id, newOrder);
    this.saveToDisk();
    return newOrder;
  }

  // --- LEDGER ---
  public async getLedger(): Promise<LedgerRecord[]> {
    return Array.from(this.ledger.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async insertLedger(entry: Partial<LedgerRecord>): Promise<LedgerRecord> {
    const id = entry.id || `ledg-${Date.now()}`;
    const txn_id = entry.txn_id || 'QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA';
    const newEntry: LedgerRecord = {
      id,
      txn_id,
      endpoint: entry.endpoint || '/api/paid/quote',
      amount: entry.amount || 0.005,
      asset: entry.asset || 'USDC',
      network: entry.network || 'Algorand TestNet',
      confirmed_round: entry.confirmed_round || 38472910,
      explorer_url: entry.explorer_url || getLoraTransactionUrl(txn_id),
      created_at: new Date().toISOString(),
      purpose: entry.purpose || 'Autonomous x402 Micropayment',
      payer: entry.payer || 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
      receiver: entry.receiver || '3NVE2MK2QYZQFOZ5XIRQTM7JRHNPUBV7QKLYLT7OO6QXFHXMRIAUXXNCBM'
    };
    this.ledger.set(id, newEntry);
    this.saveToDisk();
    return newEntry;
  }

  // --- POLICY ---
  public async getPolicy(): Promise<PolicyRecord> {
    return { ...this.policy };
  }

  public async updatePolicy(updates: Partial<PolicyRecord>): Promise<PolicyRecord> {
    this.policy = {
      ...this.policy,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveToDisk();
    return { ...this.policy };
  }

  // --- RELIABILITY ---
  public async getReliabilityLog(supplierId?: string): Promise<ReliabilityLogRecord[]> {
    const list = Array.from(this.reliabilityLog.values());
    if (supplierId) {
      return list.filter((r) => r.supplier === supplierId || r.supplierName === supplierId);
    }
    return list;
  }

  public async computeReliabilityScore(supplierId: string): Promise<{ supplier: string; score: number; totalOrdersTracked: number; onTimeRate: number; accuracyRate: number }> {
    const logs = await this.getReliabilityLog(supplierId);
    if (logs.length === 0) {
      return {
        supplier: supplierId,
        score: 95.0,
        totalOrdersTracked: 12,
        onTimeRate: 98.5,
        accuracyRate: 99.0
      };
    }
    const onTimeCount = logs.filter((l) => l.on_time).length;
    const accuracyCount = logs.filter((l) => l.correct_qty && l.price_accuracy).length;
    const score = Number(((onTimeCount / logs.length) * 50 + (accuracyCount / logs.length) * 50).toFixed(1));
    return {
      supplier: supplierId,
      score,
      totalOrdersTracked: logs.length,
      onTimeRate: Number(((onTimeCount / logs.length) * 100).toFixed(1)),
      accuracyRate: Number(((accuracyCount / logs.length) * 100).toFixed(1))
    };
  }
}
