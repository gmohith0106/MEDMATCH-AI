import {
  AlgorandAccountInfo,
  AlgorandService,
  AlgorandTransactionResult
} from './algorand.interface';
import { getCurrentIsoDate } from '../../utils/dates';
import { logger } from '../../utils/logger';

export class MockAlgorandService implements AlgorandService {
  getNetwork(): string {
    return 'algorand-testnet';
  }

  getExplorerUrl(txId: string): string {
    return `https://lora.algokit.io/testnet/transaction/${txId}`;
  }

  async checkHealth(): Promise<{ algodHealthy: boolean; indexerHealthy: boolean }> {
    return { algodHealthy: true, indexerHealthy: true };
  }

  async getAccountInfo(address: string): Promise<AlgorandAccountInfo | null> {
    return {
      address,
      amountMicroAlgos: 10000000,
      amountAlgos: 10,
      minBalanceMicroAlgos: 100000,
      status: 'Online'
    };
  }

  async getTransaction(txId: string): Promise<AlgorandTransactionResult | null> {
    return {
      network: 'algorand-testnet',
      transactionId: txId,
      confirmedRound: 38472910,
      status: 'CONFIRMED',
      sender: 'ALGO7W2K6XJ4PL9QNZR8YV1M3TB5D0E4G2F9C7H1',
      receiver: 'ALGO9Z3X4Y5W6V7U8T9S0R1Q2P3O4N5M6L7K8J9I',
      amountMicroAlgos: 20000,
      amountAlgos: 0.02,
      timestamp: getCurrentIsoDate(),
      explorerUrl: this.getExplorerUrl(txId)
    };
  }

  async verifyTransaction(txId: string): Promise<AlgorandTransactionResult> {
    logger.info(`[MockAlgorandService] Verified Algorand TestNet transaction: ${txId}`);
    return {
      network: 'algorand-testnet',
      transactionId: txId,
      confirmedRound: 38472910,
      status: 'CONFIRMED',
      sender: 'ALGO7W2K6XJ4PL9QNZR8YV1M3TB5D0E4G2F9C7H1',
      receiver: 'ALGO9Z3X4Y5W6V7U8T9S0R1Q2P3O4N5M6L7K8J9I',
      amountMicroAlgos: 20000,
      amountAlgos: 0.02,
      timestamp: getCurrentIsoDate(),
      explorerUrl: this.getExplorerUrl(txId)
    };
  }

  async sendPayment(
    receiverAddress: string,
    amountAlgos: number,
    note?: string
  ): Promise<AlgorandTransactionResult> {
    const txId = 'ALGO-TXN-VERIFIED-001';
    return {
      network: 'algorand-testnet',
      transactionId: txId,
      confirmedRound: 38472910,
      status: 'CONFIRMED',
      sender: 'ALGO7W2K6XJ4PL9QNZR8YV1M3TB5D0E4G2F9C7H1',
      receiver: receiverAddress,
      amountMicroAlgos: Math.round(amountAlgos * 1_000_000),
      amountAlgos,
      note,
      timestamp: getCurrentIsoDate(),
      explorerUrl: this.getExplorerUrl(txId)
    };
  }
}

