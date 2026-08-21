import { SpendPolicyService } from '../src/services/payments/spend-policy.service';
import { ALGORAND_TESTNET_CAIP2, ALGORAND_MAINNET_CAIP2 } from '../src/config/constants';
import { env } from '../src/config/env';

describe('Test 3 — Spend Policy & Agent Controls', () => {
  const spendPolicy = new SpendPolicyService();

  it('should approve valid Algorand Testnet USDC micropayment within limits', async () => {
    const decision = await spendPolicy.evaluate({
      resource: '/api/paid/supplier-intelligence',
      network: ALGORAND_TESTNET_CAIP2,
      asset: 'USDC',
      amount: 0.02,
      payTo: env.ALGORAND_RECEIVER_ADDRESS || 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU',
      hospitalId: 'hospital-citycare-001'
    });

    expect(decision.approved).toBe(true);
    expect(decision.decision).toBe('SPEND_POLICY_APPROVED');
  });

  it('should reject payment requests exceeding single transaction limit ($0.05)', async () => {
    const decision = await spendPolicy.evaluate({
      resource: '/api/paid/supplier-intelligence',
      network: ALGORAND_TESTNET_CAIP2,
      asset: 'USDC',
      amount: 50.00, // Exceeds $0.05 limit
      payTo: env.ALGORAND_RECEIVER_ADDRESS || 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU',
      hospitalId: 'hospital-citycare-001'
    });

    expect(decision.approved).toBe(false);
    expect(decision.decision).toBe('SPEND_POLICY_REJECTED');
    expect(decision.reason).toContain('exceeds maximum per-transaction limit');
  });

  it('should reject payment requests for non-allowlisted resources', async () => {
    const decision = await spendPolicy.evaluate({
      resource: '/api/untrusted-external-resource',
      network: ALGORAND_TESTNET_CAIP2,
      asset: 'USDC',
      amount: 0.02,
      payTo: env.ALGORAND_RECEIVER_ADDRESS || 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU',
      hospitalId: 'hospital-citycare-001'
    });

    expect(decision.approved).toBe(false);
    expect(decision.decision).toBe('SPEND_POLICY_REJECTED');
    expect(decision.reason).toContain('not in the agent allowlisted endpoints');
  });

  it('should reject unsupported blockchain networks', async () => {
    const decision = await spendPolicy.evaluate({
      resource: '/api/paid/supplier-intelligence',
      network: 'eip155:1', // Ethereum mainnet
      asset: 'USDC',
      amount: 0.02,
      payTo: env.ALGORAND_RECEIVER_ADDRESS || 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU',
      hospitalId: 'hospital-citycare-001'
    });

    expect(decision.approved).toBe(false);
    expect(decision.decision).toBe('SPEND_POLICY_REJECTED');
    expect(decision.reason).toContain('not an authorized payment network');
  });
});
