import algosdk from 'algosdk';
import {
  AlgorandAccountInfo,
  AlgorandService,
  AlgorandTransactionResult
} from './algorand.interface';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';
import { getCurrentIsoDate } from '../../utils/dates';
import { logger } from '../../utils/logger';
import {
  ALGORAND_TESTNET_CAIP2,
  ALGORAND_MAINNET_CAIP2,
  USDC_TESTNET_ASA_ID,
  USDC_MAINNET_ASA_ID
} from '../../config/constants';

export class AlgorandServiceImpl implements AlgorandService {
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;

  constructor() {
    const token = env.ALGORAND_API_TOKEN || '';
    const nodeUrl = env.ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud';
    const indexerUrl = env.ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud';
    const port = env.ALGORAND_PORT || '443';

    this.algodClient = new algosdk.Algodv2(token, nodeUrl, port);
    this.indexerClient = new algosdk.Indexer(token, indexerUrl, port);
  }

  getNetwork(): string {
    return env.ALGORAND_NETWORK || ALGORAND_TESTNET_CAIP2;
  }

  getExplorerUrl(txId: string): string {
    if (!txId) return '';
    const base = env.ALGORAND_EXPLORER_BASE_URL || 'https://lora.algokit.io/testnet/transaction';
    return `${base.replace(/\/$/, '')}/${txId}`;
  }

  async checkHealth(): Promise<{ algodHealthy: boolean; indexerHealthy: boolean }> {
    let algodHealthy = false;
    let indexerHealthy = false;

    const timeout = <T>(promise: Promise<T>, ms = 2000): Promise<T> =>
      Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Network timeout')), ms))
      ]);

    try {
      await timeout(this.algodClient.status().do());
      algodHealthy = true;
    } catch (err) {
      logger.debug('[AlgorandService] Algod health check status', err);
    }

    try {
      await timeout(this.indexerClient.makeHealthCheck().do());
      indexerHealthy = true;
    } catch (err) {
      logger.debug('[AlgorandService] Indexer health check status', err);
    }

    return { algodHealthy, indexerHealthy };
  }

  async getAccountInfo(address: string): Promise<AlgorandAccountInfo | null> {
    if (!address || !algosdk.isValidAddress(address)) {
      return null;
    }

    try {
      const info: any = await this.algodClient.accountInformation(address).do();
      const amountMicroAlgos = Number(info.amount || 0);
      const minBalanceMicroAlgos = Number(info.minBalance || info['min-balance'] || 100000);

      return {
        address,
        amountMicroAlgos,
        amountAlgos: amountMicroAlgos / 1_000_000,
        minBalanceMicroAlgos,
        status: info.status || 'Offline'
      };
    } catch (error) {
      logger.error(`[AlgorandService] Failed to query account info for ${address}`, error);
      return null;
    }
  }

  async getTransaction(txId: string): Promise<AlgorandTransactionResult | null> {
    if (!txId || txId.trim() === '') {
      return null;
    }

    try {
      logger.info(`[AlgorandService] Querying on-chain transaction: ${txId}`);
      const res: any = await this.indexerClient.lookupTransactionByID(txId).do();
      const tx: any = res?.transaction;

      if (!tx) {
        return {
          network: this.getNetwork(),
          transactionId: txId,
          status: 'NOT_FOUND',
          timestamp: getCurrentIsoDate(),
          explorerUrl: this.getExplorerUrl(txId)
        };
      }

      const confirmedRound = Number(tx.confirmedRound || tx['confirmed-round'] || 0);
      const paymentTx = tx.paymentTransaction || tx['payment-transaction'] || tx.payment;
      const assetTransferTx = tx.assetTransferTransaction || tx['asset-transfer-transaction'];

      const sender = tx.sender;
      const receiver =
        paymentTx?.receiver ||
        paymentTx?.['receiver'] ||
        assetTransferTx?.receiver ||
        assetTransferTx?.['receiver'];

      let amountMicroAlgos: number | undefined;
      let amountAlgos: number | undefined;
      let assetId: number | undefined;

      if (paymentTx) {
        amountMicroAlgos = Number(paymentTx.amount || 0);
        amountAlgos = amountMicroAlgos / 1_000_000;
      } else if (assetTransferTx) {
        assetId = Number(assetTransferTx['asset-id'] || assetTransferTx.assetId || 0);
        const rawAmount = Number(assetTransferTx.amount || 0);
        amountMicroAlgos = rawAmount;
        amountAlgos = rawAmount / 1_000_000; // 6 decimals for standard USDC
      }

      const feeMicroAlgos = Number(tx.fee || 1000);
      const roundTimeNum = tx.roundTime || tx['round-time'];
      const roundTime = roundTimeNum ? new Date(roundTimeNum * 1000).toISOString() : getCurrentIsoDate();

      let noteDecoded: string | undefined;
      if (tx.note) {
        try {
          if (typeof tx.note === 'string') {
            noteDecoded = Buffer.from(tx.note, 'base64').toString('utf8');
          } else if (tx.note instanceof Uint8Array || Buffer.isBuffer(tx.note)) {
            noteDecoded = Buffer.from(tx.note).toString('utf8');
          }
        } catch {
          // Ignore note decode error
        }
      }

      return {
        network: this.getNetwork(),
        transactionId: txId,
        confirmedRound,
        status: 'CONFIRMED',
        sender: sender ? sender.toString() : undefined,
        receiver: receiver ? receiver.toString() : undefined,
        amountMicroAlgos,
        amountAlgos,
        assetId,
        feeMicroAlgos,
        note: noteDecoded,
        timestamp: roundTime,
        explorerUrl: this.getExplorerUrl(txId),
        raw: tx as unknown as Record<string, unknown>
      };
    } catch (error: any) {
      if (error?.status === 404 || error?.response?.status === 404) {
        logger.info(`[AlgorandService] Transaction ${txId} not yet indexed`);
        return {
          network: this.getNetwork(),
          transactionId: txId,
          status: 'PENDING',
          timestamp: getCurrentIsoDate(),
          explorerUrl: this.getExplorerUrl(txId)
        };
      }

      logger.error(`[AlgorandService] Error querying indexer for ${txId}`, error);
      return null;
    }
  }

  async verifyTransaction(
    txId: string,
    expectedReceiver?: string,
    expectedMinAmountAlgos?: number
  ): Promise<AlgorandTransactionResult> {
    let tx: any = null;
    let retries = 0;
    
    // Retry loop to handle Indexer latency on Algorand TestNet
    while (retries < 6) {
      tx = await this.getTransaction(txId);
      if (tx && tx.status === 'CONFIRMED') {
        break;
      }
      logger.info(`[AlgorandService] Tx ${txId} not yet confirmed by indexer, retrying (${retries + 1}/6)...`);
      await new Promise(r => setTimeout(r, 2000));
      retries++;
    }

    if (!tx || tx.status !== 'CONFIRMED') {
      throw new AppError(
        `Algorand transaction ${txId} is not confirmed on ${this.getNetwork()}`,
        400,
        'TRANSACTION_NOT_CONFIRMED'
      );
    }

    if (expectedReceiver && tx.receiver && tx.receiver !== expectedReceiver) {
      throw new AppError(
        `Transaction receiver mismatch: expected ${expectedReceiver}, found ${tx.receiver}`,
        400,
        'INVALID_RECEIVER'
      );
    }

    if (expectedMinAmountAlgos !== undefined && tx.amountAlgos !== undefined) {
      if (tx.amountAlgos < expectedMinAmountAlgos) {
        throw new AppError(
          `Transaction amount insufficient: expected >= ${expectedMinAmountAlgos}, found ${tx.amountAlgos}`,
          400,
          'INSUFFICIENT_AMOUNT'
        );
      }
    }

    return tx;
  }

  async sendPayment(
    receiverAddress: string,
    amountAlgos: number,
    note?: string
  ): Promise<AlgorandTransactionResult> {
    // 1. Safety verification
    if (this.getNetwork() === ALGORAND_MAINNET_CAIP2 && env.NODE_ENV !== 'production') {
      throw new AppError('MainNet transactions are disabled in non-production environments', 400, 'INVALID_NETWORK');
    }

    if (!env.ALGORAND_SENDER_MNEMONIC) {
      throw new AppError(
        'Autonomous agent payer wallet is not configured. Please set ALGORAND_SENDER_MNEMONIC in environment variables.',
        400,
        'PAYMENT_CONFIGURATION_REQUIRED'
      );
    }

    if (!receiverAddress || !algosdk.isValidAddress(receiverAddress)) {
      throw new AppError(`Invalid Algorand receiver address: ${receiverAddress}`, 400, 'INVALID_RECEIVER');
    }

    try {
      const senderAccount = algosdk.mnemonicToSecretKey(env.ALGORAND_SENDER_MNEMONIC);
      const senderAddress = senderAccount.addr.toString();

      const suggestedParams = await this.algodClient.getTransactionParams().do();
      const amountMicroAlgos = Math.round(amountAlgos * 1_000_000);
      const noteUint8 = note ? new TextEncoder().encode(note) : undefined;

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: senderAddress,
        receiver: receiverAddress,
        amount: amountMicroAlgos,
        suggestedParams,
        note: noteUint8
      });

      const signedTxn = txn.signTxn(senderAccount.sk);
      const sendResult: any = await this.algodClient.sendRawTransaction(signedTxn).do();
      const txId: string = sendResult?.txId || sendResult?.txid || (txn as any).txID().toString();

      logger.info(`[AlgorandService] Submitted on-chain transaction ${txId}, waiting for confirmation...`);
      const confirmedTxn: any = await algosdk.waitForConfirmation(this.algodClient, txId, 4);

      const confirmedRound = Number(
        confirmedTxn?.['confirmed-round'] || confirmedTxn?.confirmedRound || (suggestedParams as any)?.firstValid || 1
      );
      const roundTime = getCurrentIsoDate();

      return {
        network: this.getNetwork(),
        transactionId: txId,
        confirmedRound,
        status: 'CONFIRMED',
        sender: senderAddress,
        receiver: receiverAddress,
        amountMicroAlgos,
        amountAlgos,
        feeMicroAlgos: Number((suggestedParams as any).fee || 1000),
        note,
        timestamp: roundTime,
        explorerUrl: this.getExplorerUrl(txId),
        raw: confirmedTxn as unknown as Record<string, unknown>
      };
    } catch (error: any) {
      logger.error('[AlgorandService] Failed to execute on-chain payment', error);
      throw new AppError(
        `Algorand payment submission failed: ${error?.message || 'Unknown network error'}`,
        500,
        'PAYMENT_FAILED'
      );
    }
  }
}
