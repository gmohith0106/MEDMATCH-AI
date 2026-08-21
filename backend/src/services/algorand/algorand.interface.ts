export interface AlgorandTransactionResult {
  network: string;
  transactionId: string;
  confirmedRound?: number;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED' | 'NOT_FOUND';
  sender?: string;
  receiver?: string;
  amountMicroAlgos?: number;
  amountAlgos?: number;
  assetId?: number;
  feeMicroAlgos?: number;
  note?: string;
  timestamp: string;
  explorerUrl?: string;
  raw?: Record<string, unknown>;
}

export interface AlgorandAccountInfo {
  address: string;
  amountMicroAlgos: number;
  amountAlgos: number;
  minBalanceMicroAlgos: number;
  status: string;
}

export interface AlgorandService {
  getNetwork(): string;
  getExplorerUrl(txId: string): string;
  getTransaction(txId: string): Promise<AlgorandTransactionResult | null>;
  verifyTransaction(
    txId: string,
    expectedReceiver?: string,
    expectedMinAmountAlgos?: number
  ): Promise<AlgorandTransactionResult>;
  getAccountInfo(address: string): Promise<AlgorandAccountInfo | null>;
  sendPayment(
    receiverAddress: string,
    amountAlgos: number,
    note?: string
  ): Promise<AlgorandTransactionResult>;
  checkHealth(): Promise<{ algodHealthy: boolean; indexerHealthy: boolean }>;
}

