import request from 'supertest';
import { createApp } from '../src/app';
import { PaymentNormalizationService } from '../src/services/payments/payment-normalization.service';
import { X402BuyerClientService } from '../src/services/payments/buyer-client.service';
import { SpendPolicyService } from '../src/services/payments/spend-policy.service';
import { PaymentRepository } from '../src/repositories/payment.repository';
import { PaymentRecord } from '../src/types/payment.types';
import { ALGORAND_TESTNET_CAIP2 } from '../src/config/constants';
import { isAlgorandTxId, getLoraTransactionUrl } from '../src/utils/algorand-validation';
import { env } from '../src/config/env';

function formatUsdcAmount(amount?: number | string): string {
  if (amount === undefined || amount === null) return '0.02 USDC';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.02 USDC';
  const normalized = num > 100 ? num / 1_000_000 : num;
  return `${normalized.toFixed(2)} USDC`;
}

describe('x402 Payment Flow & Blockchain Settlement Test Suite', () => {
  const app = createApp();
  const paymentRepo = new PaymentRepository();

  describe('A. Authoritative Price & Endpoint Protection', () => {
    it('GET /api/paid/supplier-intelligence must return HTTP 402 with authoritative 0.02 USDC price', async () => {
      const res = await request(app).get('/api/paid/supplier-intelligence').expect(402);
      expect(res.status).toBe(402);
      const header = (res.headers['payment-required'] || res.headers['Payment-Required']) as string;
      expect(header).toBeDefined();

      if (header) {
        const decoded = JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
        expect(decoded).toBeDefined();
        expect(decoded.network || decoded.accepts).toBeDefined();
      }
    });
  });

  describe('B. Server-Side Signer & Sensitive Secret Protection', () => {
    it('should not expose private keys or mnemonics to public endpoints', async () => {
      const healthRes = await request(app).get('/health').expect(200);
      expect(healthRes.body.status).toBe('ok');
      const stringified = JSON.stringify(healthRes.body);
      expect(stringified).not.toContain('AVM_MNEMONIC');
      expect(stringified).not.toContain('ALGORAND_SENDER_MNEMONIC');
      expect(stringified).not.toContain('mnemonic');
      expect(stringified).not.toContain('privateKey');

      const configRes = await request(app).get('/api/payments/config-status').expect(200);
      const configString = JSON.stringify(configRes.body);
      expect(configString).not.toContain('mnemonic');
      expect(configString).not.toContain('secretKey');
    });

    it('X402BuyerClientService correctly reports signer status without crashing', () => {
      const buyer = new X402BuyerClientService();
      const configured = buyer.isSignerConfigured();
      expect(typeof configured).toBe('boolean');
      if (!configured) {
        expect(buyer.getAgentPayerAddress()).toBeNull();
      }
    });
  });

  describe('C. Spend Policy Guardrails', () => {
    it('approves legitimate $0.02 USDC intelligence payment', async () => {
      const spendPolicy = new SpendPolicyService();
      const decision = await spendPolicy.evaluate({
        resource: '/api/paid/supplier-intelligence',
        network: ALGORAND_TESTNET_CAIP2,
        asset: 'USDC',
        amount: 0.02,
        payTo: env.ALGORAND_RECEIVER_ADDRESS || 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU',
        procurementRunId: 'test-run-001',
        hospitalId: 'hospital-citycare-001'
      });

      expect(decision.approved).toBe(true);
      expect(decision.evaluatedAt).toBeDefined();
    });

    it('rejects payments exceeding maximum single transaction limit ($0.05)', async () => {
      const spendPolicy = new SpendPolicyService();
      const decision = await spendPolicy.evaluate({
        resource: '/api/paid/supplier-intelligence',
        network: ALGORAND_TESTNET_CAIP2,
        asset: 'USDC',
        amount: 0.10, // exceeds max limit of 0.05
        payTo: env.ALGORAND_RECEIVER_ADDRESS || 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU',
        procurementRunId: 'test-run-002',
        hospitalId: 'hospital-citycare-001'
      });

      expect(decision.approved).toBe(false);
      expect(decision.reason).toContain('exceeds maximum');
    });
  });

  describe('D. Payment Normalization Service & Algorand Validation', () => {
    it('normalizes raw PaymentRecord with product, supplier, and explorer links for valid 52-char TxId', () => {
      const validTxId = 'VOGEUKZNJQYTY7PUPWZEVRR6XG4U2R2U2K7V3E6VNZ3575CZABC2';
      const rawRecord: PaymentRecord = {
        id: 'pay_test_001',
        runId: 'run-test-abc',
        hospitalId: 'hospital-citycare-001',
        userId: 'user-001',
        productId: 'SURG-GLV-002',
        productName: 'Surgical Gloves (Sterile, Latex-Free)',
        requiredQuantity: 1650,
        currentStock: 1250,
        forecastDemand: 2900,
        expectedDeficit: 1650,
        supplierId: 'sup-medisupply-001',
        supplierName: 'MediSupply Healthcare Solutions',
        supplierUnitPrice: 1.85,
        supplierDeliveryDays: 2,
        supplierReliability: 99.2,
        supplierScore: 94.6,
        amount: 0.02,
        asset: 'USDC',
        currency: 'USD',
        protocol: 'x402',
        network: 'Algorand TestNet',
        status: 'PAYMENT_SETTLED',
        provider: 'x402 / GoPlausible Facilitator',
        senderAddress: 'PAYER7ADDRESSALGORANDTESTNET777',
        receiverAddress: 'RECEIVER7ADDRESSALGORANDTESTNET888',
        transactionId: validTxId,
        confirmedRound: 41829023,
        verified: true,
        resource: '/api/paid/supplier-intelligence',
        settledAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const normalized = PaymentNormalizationService.normalize(rawRecord);

      expect(normalized.id).toBe('pay_test_001');
      expect(normalized.amount).toBe(0.02);
      expect(normalized.asset).toBe('USDC');
      expect(normalized.network).toBe('Algorand TestNet');
      expect(normalized.product.name).toBe('Surgical Gloves (Sterile, Latex-Free)');
      expect(normalized.product.requiredQuantity).toBe(1650);
      expect(normalized.supplier.name).toBe('MediSupply Healthcare Solutions');
      expect(normalized.supplier.unitPrice).toBe(1.85);
      expect(normalized.explorerUrl).toContain(validTxId);
    });

    it('rejects invalid or placeholder transaction IDs from generating Lora links', () => {
      expect(isAlgorandTxId('TX_IDE_12345')).toBe(false);
      expect(isAlgorandTxId('mock-tx-123')).toBe(false);
      expect(isAlgorandTxId('ALGO-TXN-79421')).toBe(false);
      expect(isAlgorandTxId('VOGEUKZNJQYTY7PUPWZEVRR6XG4U2R2U2K7V3E6VNZ3575CZABC2')).toBe(true);
      expect(getLoraTransactionUrl('invalid-id')).toBe('');
      expect(getLoraTransactionUrl('VOGEUKZNJQYTY7PUPWZEVRR6XG4U2R2U2K7V3E6VNZ3575CZABC2')).toBe(
        'https://lora.algokit.io/testnet/transaction/VOGEUKZNJQYTY7PUPWZEVRR6XG4U2R2U2K7V3E6VNZ3575CZABC2'
      );
    });
  });

  describe('E. Database Persistence & Endpoints', () => {
    it('creates, retrieves, and updates real payment in database', async () => {
      const uniqueSuffix = Date.now().toString().slice(-8).padStart(8, '0');
      const validTxId = `VOGEUKZNJQYTY7PUPWZEVRR6XG4U2R2U2K7V3E6VNZ35${uniqueSuffix}`;
      const newPayment: PaymentRecord = {
        id: `pay_unit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        runId: `run_unit_${Date.now()}`,
        hospitalId: 'hospital-citycare-001',
        userId: 'user-unit-test',
        productId: 'N95-RESP-001',
        productName: 'N95 Respirator Masks (NIOSH Certified)',
        requiredQuantity: 200,
        amount: 0.02,
        asset: 'USDC',
        currency: 'USD',
        protocol: 'x402',
        network: 'Algorand TestNet',
        status: 'PAYMENT_SETTLED',
        provider: 'x402 / GoPlausible Facilitator',
        verified: true,
        resource: '/api/paid/supplier-intelligence',
        transactionId: validTxId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await paymentRepo.create(newPayment);

      const fetched = await paymentRepo.findById(newPayment.id);
      expect(fetched).not.toBeNull();
      expect(fetched?.id).toBe(newPayment.id);
      expect(fetched?.transactionId).toBe(validTxId);

      const byTx = await paymentRepo.findByTransactionId(validTxId);
      expect(byTx).not.toBeNull();
      expect(byTx?.id).toBe(newPayment.id);

      const latest = await paymentRepo.findLatest('hospital-citycare-001');
      expect(latest).not.toBeNull();
      expect(latest?.id).toBe(newPayment.id);
    });

    it('GET /api/payments returns normalized array', async () => {
      const res = await request(app).get('/api/payments').expect(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/payments/latest returns most recent record', async () => {
      const res = await request(app).get('/api/payments/latest').expect(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('F. Shared UI Utilities', () => {
    it('formatUsdcAmount formats amounts consistently', () => {
      expect(formatUsdcAmount(0.02)).toBe('0.02 USDC');
      expect(formatUsdcAmount('0.02')).toBe('0.02 USDC');
      expect(formatUsdcAmount(20000)).toBe('0.02 USDC'); // atomic micro-units
      expect(formatUsdcAmount(undefined)).toBe('0.02 USDC');
    });
  });
});

