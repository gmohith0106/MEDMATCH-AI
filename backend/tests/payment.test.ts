import { X402PaymentService } from '../src/services/payments/x402-payment.service';
import { AlgorandServiceImpl } from '../src/services/algorand/algorand.service';
import { PaymentFactory } from '../src/services/payments/payment.factory';
import { ALGORAND_TESTNET_CAIP2 } from '../src/config/constants';

// Mock the PaymentRepository
jest.mock('../src/repositories/payment.repository', () => {
  const store = new Map<string, any>();
  return {
    PaymentRepository: jest.fn().mockImplementation(() => ({
      create: jest.fn().mockImplementation(async (payment) => {
        store.set(payment.id, payment);
        return payment;
      }),
      findById: jest.fn().mockImplementation(async (id) => {
        return store.get(id) || null;
      }),
      findByHospital: jest.fn().mockImplementation(async (hospitalId) => {
        return Array.from(store.values()).filter((p) => p.hospitalId === hospitalId);
      }),
      update: jest.fn().mockImplementation(async (id, updates) => {
        const existing = store.get(id);
        if (!existing) return null;
        const updated = { ...existing, ...updates };
        store.set(id, updated);
        return updated;
      })
    }))
  };
});

describe('Real x402 Payment & Algorand Architecture', () => {
  beforeEach(() => {
    PaymentFactory.resetInstance();
  });

  it('should instantiate X402PaymentService via PaymentFactory', () => {
    const service = PaymentFactory.getService();
    expect(service.mode).toBe('x402');
  });

  it('should generate valid 402 payment requirements with base64 PAYMENT-REQUIRED header', async () => {
    const paymentService = new X402PaymentService();

    const request = await paymentService.createPaymentRequirement({
      runId: 'run-test-123',
      hospitalId: 'hospital-citycare-001',
      userId: 'user-001',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      resource: '/api/paid/supplier-intelligence',
      purpose: 'Tier-1 Certified Healthcare Supplier Network SLA & Capacity Matrix'
    });

    expect(request.paymentId).toMatch(/^pay_x402_/);
    expect(request.amount).toBe(0.02);
    expect(request.status).toBe('PAYMENT_REQUIRED');
    expect(request.protocol).toBe('x402');
    expect(request.network).toBe(ALGORAND_TESTNET_CAIP2);
    expect(request.headerPayloadBase64).toBeDefined();

    // Verify header parsing
    const parsedRequirement = paymentService.parse402Header(request.headerPayloadBase64);
    expect(parsedRequirement).not.toBeNull();
    expect(parsedRequirement?.paymentId).toBe(request.paymentId);
    expect(parsedRequirement?.network).toBe(ALGORAND_TESTNET_CAIP2);
    expect(parsedRequirement?.amount).toBe(0.02);
  });

  it('should verify on-chain Algorand service configuration and explorer URL construction', () => {
    const algorandService = new AlgorandServiceImpl();
    expect(algorandService.getNetwork()).toBe(ALGORAND_TESTNET_CAIP2);

    const explorerUrl = algorandService.getExplorerUrl('TESTTX123456');
    expect(explorerUrl).toContain('TESTTX123456');
    expect(explorerUrl).toMatch(/^https:\/\//);
  });

  it('should return honest configuration status without fake successes', async () => {
    const paymentService = new X402PaymentService();
    jest.spyOn((paymentService as any).algorandService, 'checkHealth').mockResolvedValue({
      algodHealthy: true,
      indexerHealthy: true
    });

    const config = await paymentService.getConfigStatus();

    expect(config.x402.enabled).toBe(true);
    expect(config.algorand.network).toBe(ALGORAND_TESTNET_CAIP2);
    expect(config.overallStatus).toBeDefined();
    expect(['CONNECTED', 'CONFIGURATION_REQUIRED', 'FAILED']).toContain(config.overallStatus);
    expect(config.message).toBeDefined();
  });
});
