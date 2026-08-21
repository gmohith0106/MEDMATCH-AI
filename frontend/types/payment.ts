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
  | 'PAYMENT_SIGNER_NOT_CONFIGURED'
  | 'PENDING';

export interface X402PaymentRequirement {
  scheme: 'exact';
  network: string;
  asset: string;
  amount: number;
  amountRaw: string;
  payTo: string;
  paymentId: string;
  resource: string;
  validUntil?: string;
  facilitatorUrl?: string;
  description?: string;
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
  deliveryTime?: number;
  reliability?: number;
  score?: number;
  availability?: string;
}

export interface X402PaymentRecord {
  id: string;
  paymentId?: string;
  procurementRunId?: string;
  runId?: string;
  agentRunId?: string;
  hospitalId?: string;
  userId?: string;
  
  // Product Information
  productId?: string;
  productName?: string;
  requiredQuantity?: number;
  currentStock?: number;
  forecastDemand?: number;
  expectedDeficit?: number;
  product?: PaymentProductDetails;

  // Supplier Information
  supplierId?: string;
  supplierName?: string;
  supplierUnitPrice?: number;
  supplierDeliveryDays?: number;
  supplierReliability?: number;
  supplierScore?: number;
  supplier?: PaymentSupplierDetails;

  // Financial & Protocol Details
  service?: string;
  resource?: string;
  protocol: 'x402';
  network: string;
  asset?: string;
  amount?: number;
  amountUsd?: number;
  currency?: string;
  status: PaymentStatus;

  provider?: string;
  payerPublicAddress?: string;
  senderAddress?: string;
  receiverPublicAddress?: string;
  receiverAddress?: string;
  transactionId?: string;
  confirmedRound?: number;
  round?: number;
  blockNumber?: number;
  verified?: boolean;
  verifiedAt?: string;
  settledAt?: string;
  explorerUrl?: string;
  facilitator?: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  errorMessage?: string;
  paymentRequirements?: X402PaymentRequirement;
}

export interface PaymentConfigStatus {
  x402: {
    enabled: boolean;
    facilitatorUrl?: string;
    scheme: string;
  };
  algorand: {
    network: string;
    algodConnected: boolean;
    indexerConnected: boolean;
    receiverAddressConfigured: boolean;
    receiverAddress?: string;
    agentWalletConfigured: boolean;
    agentWalletAddress?: string;
  };
  overallStatus: 'CONNECTED' | 'CONFIGURATION_REQUIRED' | 'FAILED';
  message: string;
}

export interface PaymentStats {
  totalPayments: number;
  successful: number;
  pending: number;
  totalSpendUsd: number;
  network: string;
  protocol: string;
}
