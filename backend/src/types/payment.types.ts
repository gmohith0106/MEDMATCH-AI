export type PaymentStatus =
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_PROCESSING'
  | 'SETTLEMENT_PENDING'
  | 'VERIFIED'
  | 'FAILED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUBMITTED'
  | 'PAYMENT_VERIFYING'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_SETTLED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_EXPIRED'
  | 'PAYMENT_CONFIGURATION_REQUIRED'
  | 'PAYMENT_SIGNER_NOT_CONFIGURED';

export type PaymentProtocol = 'x402';


export interface X402PaymentRequirement {
  scheme: 'exact' | 'upto';
  network: string; // e.g. 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe'
  asset: string; // 'USDC' (ASA ID: 10458941)
  amount: number; // e.g. 0.02 USD
  amountRaw: string; // integer atomic units e.g. '20000' (micro-USDC)
  payTo: string; // Algorand receiver address
  facilitatorUrl?: string;
  paymentId: string;
  resource: string;
  expiresAt: string;
  description: string;
}

export interface PaymentProductDetails {
  id?: string;
  name?: string;
  requiredQuantity?: number;
  currentStock?: number;
  forecastDemand?: number;
  expectedDeficit?: number;
}

export interface PaymentSupplierDetails {
  id?: string;
  name?: string;
  unitPrice?: number;
  deliveryDays?: number;
  reliability?: number;
  score?: number;
  availability?: string;
}

export interface PaymentRecord {
  id: string;
  procurementRunId?: string;
  runId?: string;
  agentRunId?: string;
  hospitalId: string;
  userId: string;
  
  // Product Details
  productId?: string;
  productName?: string;
  requiredQuantity?: number;
  currentStock?: number;
  forecastDemand?: number;
  expectedDeficit?: number;
  product?: PaymentProductDetails;

  // Supplier Details
  supplierId?: string;
  supplierName?: string;
  supplierUnitPrice?: number;
  supplierDeliveryDays?: number;
  supplierReliability?: number;
  supplierScore?: number;
  supplier?: PaymentSupplierDetails;

  // Financial & Protocol Parameters
  amount: number;
  amountRaw?: string;
  asset: string;
  currency: string;
  protocol: PaymentProtocol;
  network: string;
  status: PaymentStatus;
  provider: string;
  purpose?: string;
  
  // Blockchain Public Addresses & Tx
  payerPublicAddress?: string;
  senderAddress?: string;
  receiverPublicAddress?: string;
  receiverAddress?: string;
  transactionId?: string;
  blockNumber?: number;
  confirmedRound?: number;
  round?: number;
  explorerUrl?: string;
  
  // Verification & Timestamps
  verified: boolean;
  paymentRequirements?: X402PaymentRequirement;
  resource: string;
  facilitator?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  settledAt?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedPaymentResponse {
  paymentId: string;
  id: string;
  status: PaymentStatus;
  transactionId?: string;
  confirmedRound?: number;
  blockNumber?: number;
  verified: boolean;
  verifiedAt?: string;
  amount: number;
  asset: string;
  network: string;
  payerPublicAddress?: string;
  receiverPublicAddress?: string;
  product: {
    id: string;
    name: string;
    requiredQuantity: number;
    currentStock: number;
    forecastDemand: number;
    expectedDeficit: number;
  };
  supplier: {
    id: string;
    name: string;
    unitPrice: number;
    deliveryTime: number;
    reliability: number;
    score: number;
    availability: string;
  };
  resource: string;
  facilitator?: string;
  explorerUrl?: string;
  settledAt?: string;
  createdAt: string;
}

export interface PaymentRequestResult {
  paymentId: string;
  amount: number;
  asset: string;
  currency: string;
  protocol: PaymentProtocol;
  network: string;
  status: PaymentStatus;
  payToAddress: string;
  facilitatorUrl?: string;
  paymentRequirement: X402PaymentRequirement;
  headerPayloadBase64: string;
  expiresAt: string;
}

export interface PaymentVerificationResult {
  paymentId: string;
  transactionId: string;
  senderAddress?: string;
  receiverAddress?: string;
  amount?: number;
  asset?: string;
  network: string;
  status: PaymentStatus;
  verified: boolean;
  blockNumber?: number;
  confirmedRound?: number;
  explorerUrl?: string;
  verifiedAt?: string;
  settledAt?: string;
  errorMessage?: string;
}

export interface PaymentConfigStatus {
  x402: {
    enabled: boolean;
    configured: boolean;
    facilitatorUrl?: string;
    mode: string;
  };
  algorand: {
    network: string;
    nodeUrl: string;
    indexerUrl: string;
    receiverAddressConfigured: boolean;
    receiverAddress?: string;
    senderAccountConfigured: boolean;
    senderAddress?: string;
    nodeConnected?: boolean;
    indexerConnected?: boolean;
  };
  overallStatus: 'CONNECTED' | 'CONFIGURATION_REQUIRED' | 'FAILED';
  message: string;
}
