import fs from 'fs';
import path from 'path';
import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import { PaymentRecord } from '../types/payment.types';
import { MemoryStore } from './memory-store';
import { logger } from '../utils/logger';

export class PaymentRepository {
  private ref = rtdb.ref('payments');
  private memStore = MemoryStore.getInstance();
  private filePath = path.resolve(process.cwd(), 'data', 'payments.json');

  constructor() {
    this.loadFromDisk();
  }

  private sanitizePayment(p: PaymentRecord): PaymentRecord {
    // Strip any sensitive properties if accidentally present
    const clean = { ...p };
    delete (clean as any).mnemonic;
    delete (clean as any).secret;
    delete (clean as any).privateKey;
    delete (clean as any).signer;
    return clean;
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const list: PaymentRecord[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.forEach((p) => {
            if (p.id) {
              this.memStore.payments.set(p.id, this.sanitizePayment(p));
            }
          });
          logger.debug(`[PaymentRepository] Loaded ${list.length} payment records from disk`);
        }
      }
    } catch (err) {
      logger.warn('[PaymentRepository] Failed to read payments.json from disk', err);
    }
  }

  private saveToDisk(): void {
    try {
      const dataDir = path.dirname(this.filePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const list = Array.from(this.memStore.payments.values()).map(this.sanitizePayment);
      fs.writeFileSync(this.filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      logger.warn('[PaymentRepository] Failed to save payments.json to disk', err);
    }
  }

  async create(payment: PaymentRecord): Promise<PaymentRecord> {
    const cleanPayment = this.sanitizePayment(payment);

    // Idempotency check: if payment with this id already exists, update it instead of creating duplicates
    const existing = this.memStore.payments.get(cleanPayment.id);
    if (existing) {
      return this.update(cleanPayment.id, cleanPayment) as Promise<PaymentRecord>;
    }

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(cleanPayment.id).set(cleanPayment);
      } catch (err) {
        logger.warn(`[PaymentRepository] RTDB write error for payment ${cleanPayment.id}`, err);
      }
    }

    this.memStore.payments.set(cleanPayment.id, cleanPayment);
    this.saveToDisk();
    return cleanPayment;
  }

  async findById(id: string): Promise<PaymentRecord | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.child(id).once('value');
        if (snapshot.exists()) {
          return this.sanitizePayment(snapshot.val() as PaymentRecord);
        }
      } catch (err) {
        logger.warn(`[PaymentRepository] RTDB findById error for ${id}`, err);
      }
    }
    const mem = this.memStore.payments.get(id);
    return mem ? this.sanitizePayment(mem) : null;
  }

  async findByTransactionId(txId: string): Promise<PaymentRecord | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.orderByChild('transactionId').equalTo(txId).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const firstKey = Object.keys(val)[0];
          if (firstKey) return this.sanitizePayment(val[firstKey]);
        }
      } catch (err) {
        logger.warn(`[PaymentRepository] RTDB findByTransactionId error for ${txId}`, err);
      }
    }
    const all = Array.from(this.memStore.payments.values());
    const found = all.find((p) => p.transactionId === txId);
    return found ? this.sanitizePayment(found) : null;
  }

  async findByRunId(runId: string): Promise<PaymentRecord | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.orderByChild('runId').equalTo(runId).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const firstKey = Object.keys(val)[0];
          if (firstKey) return this.sanitizePayment(val[firstKey]);
        }
      } catch (err) {
        logger.warn(`[PaymentRepository] RTDB findByRunId error for ${runId}`, err);
      }
    }
    const all = Array.from(this.memStore.payments.values());
    const found = all.find((p) => p.runId === runId || p.agentRunId === runId || (p.metadata as any)?.procurementRunId === runId);
    return found ? this.sanitizePayment(found) : null;
  }

  async findByHospital(hospitalId: string): Promise<PaymentRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.ref.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const payments: PaymentRecord[] = Object.values(val);
          payments.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          return payments.map(this.sanitizePayment);
        }
      } catch (err) {
        logger.warn('[PaymentRepository] RTDB list error', err);
      }
    }

    const payments = Array.from(this.memStore.payments.values()).filter(
      (p) => !p.hospitalId || p.hospitalId === hospitalId || p.hospitalId === 'hospital-citycare-001'
    );
    payments.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return payments.map(this.sanitizePayment);
  }

  async findLatest(hospitalId: string): Promise<PaymentRecord | null> {
    const list = await this.findByHospital(hospitalId);
    return list.length > 0 ? list[0]! : null;
  }

  async update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: PaymentRecord = this.sanitizePayment({
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (hasDatabaseCredentials) {
      try {
        await this.ref.child(id).update(updated);
      } catch (err) {
        logger.warn(`[PaymentRepository] RTDB update error for ${id}`, err);
      }
    }

    this.memStore.payments.set(id, updated);
    this.saveToDisk();
    return updated;
  }
}
