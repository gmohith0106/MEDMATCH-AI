import { PaymentNormalizationService } from '../src/services/payments/payment-normalization.service';
import { PaymentRepository } from '../src/repositories/payment.repository';
import { PaymentRecord } from '../src/types/payment.types';
import { isAlgorandTxId, getLoraTransactionUrl } from '../src/utils/algorand-validation';
import { PaymentController } from '../src/controllers/payment.controller';
import { X402BuyerClientService } from '../src/services/payments/buyer-client.service';
import { AlgorandServiceImpl } from '../src/services/algorand/algorand.service';

const makeValidAlgorandTxId = (id: string = '0000'): string => {
  return ('VOGEUKZNJQYTY7PUPWZEVRR6XG4U2R2U2K7V3E6VNZ3575CZ' + id.padStart(4, 'A')).slice(0, 52);
};

describe('Pending Payment Support & On-Chain Status Verification', () => {
  const paymentRepo = new PaymentRepository();
  const hospitalId = 'hospital-citycare-001';

  it('Case 1: Unpaid payment record is normalized to canonical PAYMENT_REQUIRED state without fake transaction IDs', async () => {
    const paymentId = `pay_test_unpaid_${Date.now()}`;
    const unpaidRecord: PaymentRecord = {
      id: paymentId,
      hospitalId,
      userId: 'test-user',
      productId: 'SURG-GLV-002',
      productName: 'Surgical Gloves (Sterile, Latex-Free)',
      requiredQuantity: 1000,
      supplierId: 'sup-medisupply-001',
      supplierName: 'MediSupply Healthcare Solutions',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      status: 'PAYMENT_REQUIRED',
      provider: 'x402 / GoPlausible Facilitator',
      verified: false,
      resource: '/api/paid/supplier-intelligence',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await paymentRepo.create(unpaidRecord);

    const saved = await paymentRepo.findById(paymentId);
    expect(saved).not.toBeNull();
    const normalized = PaymentNormalizationService.normalize(saved!);

    expect(normalized.status).toBe('PAYMENT_REQUIRED');
    expect(normalized.transactionId).toBeUndefined();
    expect(normalized.explorerUrl).toBeUndefined();
  });

  it('Case 2: Controller payPayment executes payment and updates record to VERIFIED with valid 52-char TxId', async () => {
    const paymentId = `pay_test_pay_${Date.now()}`;
    const validTxId = makeValidAlgorandTxId('PAY2');
    expect(isAlgorandTxId(validTxId)).toBe(true);
    
    await paymentRepo.create({
      id: paymentId,
      hospitalId,
      userId: 'test-user',
      productId: 'SURG-GLV-002',
      productName: 'Surgical Gloves (Sterile, Latex-Free)',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      status: 'PAYMENT_REQUIRED',
      provider: 'x402 / GoPlausible Facilitator',
      verified: false,
      resource: '/api/paid/supplier-intelligence',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    jest.spyOn(X402BuyerClientService.getInstance(), 'purchaseSupplierIntelligence').mockResolvedValueOnce({
      success: true,
      statusCode: 200,
      transactionId: validTxId,
      payerAddress: 'AYQHWAV6BI7F2B2MOI3IYIL74YLAHIVZ5ZQE6H2766OPALUDGFGVWHHEUM',
      receiverAddress: 'SLETUWVHF4NC7NS6KNMVAL2PNJGKT7EPXOWM7FNAFWFCUSH23WNPGWSACU',
      settledAt: new Date().toISOString(),
      data: { suppliers: [] }
    });

    const req: any = {
      params: { id: paymentId },
      body: {},
      hospitalId
    };
    let responseData: any = null;
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        responseData = data;
        return res;
      })
    };
    const next = jest.fn();

    await PaymentController.payPayment(req, res, next);

    expect(responseData).not.toBeNull();
    expect(responseData.success).toBe(true);
    expect(responseData.data.status).toBe('VERIFIED');
    expect(responseData.data.transactionId).toBe(validTxId);
  });

  it('Case 3: Duplicate protection — payPayment on already settled payment returns existing record without re-charging', async () => {
    const paymentId = `pay_test_dup_${Date.now()}`;
    const validTxId = makeValidAlgorandTxId('DUP3');
    
    await paymentRepo.create({
      id: paymentId,
      hospitalId,
      userId: 'test-user',
      productId: 'SURG-GLV-002',
      productName: 'Surgical Gloves (Sterile, Latex-Free)',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      status: 'VERIFIED',
      provider: 'x402 / GoPlausible Facilitator',
      transactionId: validTxId,
      verified: true,
      resource: '/api/paid/supplier-intelligence',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const spyBuyer = jest.spyOn(X402BuyerClientService.getInstance(), 'purchaseSupplierIntelligence');

    const req: any = {
      params: { id: paymentId },
      body: {},
      hospitalId
    };
    let responseData: any = null;
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        responseData = data;
        return res;
      })
    };
    const next = jest.fn();

    await PaymentController.payPayment(req, res, next);

    expect(spyBuyer).not.toHaveBeenCalled();
    expect(responseData.data.status).toBe('VERIFIED');
    expect(responseData.data.transactionId).toBe(validTxId);
  });

  it('Case 4: checkPaymentStatus checks Algorand TestNet and transitions SETTLEMENT_PENDING to VERIFIED', async () => {
    const paymentId = `pay_test_check_${Date.now()}`;
    const validTxId = makeValidAlgorandTxId('CHK4');

    await paymentRepo.create({
      id: paymentId,
      hospitalId,
      userId: 'test-user',
      productId: 'SURG-GLV-002',
      productName: 'Surgical Gloves (Sterile, Latex-Free)',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      status: 'SETTLEMENT_PENDING',
      provider: 'x402 / GoPlausible Facilitator',
      transactionId: validTxId,
      verified: false,
      resource: '/api/paid/supplier-intelligence',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    jest.spyOn(AlgorandServiceImpl.prototype, 'getTransaction').mockResolvedValueOnce({
      network: 'Algorand TestNet',
      transactionId: validTxId,
      confirmedRound: 42190800,
      status: 'CONFIRMED',
      timestamp: new Date().toISOString(),
      explorerUrl: `https://lora.algokit.io/testnet/transaction/${validTxId}`
    });

    const req: any = {
      params: { id: paymentId },
      body: {},
      hospitalId
    };
    let responseData: any = null;
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        responseData = data;
        return res;
      })
    };
    const next = jest.fn();

    await PaymentController.checkPaymentStatus(req, res, next);

    expect(responseData.data.status).toBe('VERIFIED');
    expect(responseData.data.transactionId).toBe(validTxId);
  });

  it('Case 5: Canonical 5-state normalization handles all status variations consistently', () => {
    const validTxId = makeValidAlgorandTxId('ST55');

    // 1. PAYMENT_REQUIRED
    const reqNorm = PaymentNormalizationService.normalize({
      id: 'p1',
      hospitalId: 'h1',
      userId: 'u1',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      provider: 'GoPlausible',
      verified: false,
      resource: '/api/paid/supplier-intelligence',
      status: 'PAYMENT_REQUIRED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    expect(reqNorm.status).toBe('PAYMENT_REQUIRED');

    // 2. PAYMENT_PROCESSING
    const procNorm = PaymentNormalizationService.normalize({
      id: 'p2',
      hospitalId: 'h1',
      userId: 'u1',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      provider: 'GoPlausible',
      verified: false,
      resource: '/api/paid/supplier-intelligence',
      status: 'PAYMENT_PROCESSING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    expect(procNorm.status).toBe('PAYMENT_PROCESSING');

    // 3. SETTLEMENT_PENDING
    const pendNorm = PaymentNormalizationService.normalize({
      id: 'p3',
      hospitalId: 'h1',
      userId: 'u1',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      provider: 'GoPlausible',
      verified: false,
      resource: '/api/paid/supplier-intelligence',
      status: 'PAYMENT_SUBMITTED',
      transactionId: validTxId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    expect(pendNorm.status).toBe('SETTLEMENT_PENDING');

    // 4. VERIFIED
    const verNorm = PaymentNormalizationService.normalize({
      id: 'p4',
      hospitalId: 'h1',
      userId: 'u1',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      provider: 'GoPlausible',
      resource: '/api/paid/supplier-intelligence',
      status: 'PAYMENT_SETTLED',
      transactionId: validTxId,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    expect(verNorm.status).toBe('VERIFIED');
    expect(verNorm.explorerUrl).toBe(`https://lora.algokit.io/testnet/transaction/${validTxId}`);

    // 5. FAILED
    const failNorm = PaymentNormalizationService.normalize({
      id: 'p5',
      hospitalId: 'h1',
      userId: 'u1',
      amount: 0.02,
      asset: 'USDC',
      currency: 'USD',
      protocol: 'x402',
      network: 'Algorand TestNet',
      provider: 'GoPlausible',
      verified: false,
      resource: '/api/paid/supplier-intelligence',
      status: 'PAYMENT_FAILED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    expect(failNorm.status).toBe('FAILED');
  });
});
