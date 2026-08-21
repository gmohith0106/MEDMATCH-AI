import { SpendPolicyService } from '../src/services/payments/spend-policy.service';
import { PaymentRepository } from '../src/repositories/payment.repository';
import { ALGORAND_TESTNET_CAIP2 } from '../src/config/constants';
import { env } from '../src/config/env';

describe('Test 6 — Duplicate Protection & Idempotency', () => {
  const paymentRepo = new PaymentRepository();
  const spendPolicy = new SpendPolicyService(paymentRepo);

  it('should recognize previous settled run and approve reuse without double-charge', async () => {
    const runId = `run-test-idempotency-${Date.now()}`;

    // Seed a settled payment for this run
    await paymentRepo.create({
      id: `pay-${runId}`,
      runId,
      agentRunId: runId,
      hospitalId: 'hospital-citycare-001',
      userId: 'test-user',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: ALGORAND_TESTNET_CAIP2,
      status: 'PAYMENT_SETTLED',
      provider: 'x402 / GoPlausible Facilitator',
      transactionId: `VOGEUKZNJQYTY7PUPWZEVRR6XG4U2R2U2K7V3E6VNZ35${Date.now().toString().slice(-7)}`,
      verified: true,
      resource: '/api/paid/supplier-intelligence',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Evaluate spend policy for the same run
    const decision = await spendPolicy.evaluate({
      resource: '/api/paid/supplier-intelligence',
      network: ALGORAND_TESTNET_CAIP2,
      asset: 'USDC',
      amount: 0.02,
      payTo: env.ALGORAND_RECEIVER_ADDRESS || 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU',
      procurementRunId: runId,
      hospitalId: 'hospital-citycare-001'
    });

    expect(decision.approved).toBe(true);
    expect(decision.reason).toContain('Idempotency match');
  });
});
