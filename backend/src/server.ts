import { app } from './app';
import { env, validateStartupConfig } from './config/env';
import { logger } from './utils/logger';
import algosdk from 'algosdk';

validateStartupConfig();

const isReceiverConfigured = Boolean(
  env.ALGORAND_RECEIVER_ADDRESS &&
  env.ALGORAND_RECEIVER_ADDRESS.length === 58 &&
  algosdk.isValidAddress(env.ALGORAND_RECEIVER_ADDRESS)
);
const isPayerConfigured = Boolean(
  env.ALGORAND_SENDER_MNEMONIC &&
  env.ALGORAND_SENDER_MNEMONIC.trim().split(/\s+/).length >= 24
);

const server = app.listen(env.PORT, () => {
  logger.info(`----------------------------------------------------`);
  logger.info(`🏥 MedMatch AI Backend`);
  logger.info(`----------------------------------------------------`);
  logger.info(`Server:        OK (http://localhost:${env.PORT})`);
  logger.info(`x402:          ENABLED (@x402/core v2.23.0)`);
  logger.info(`Algorand:      TESTNET (${env.ALGORAND_NETWORK})`);
  logger.info(`Algod:         ${env.ALGORAND_NODE_URL}`);
  logger.info(`Indexer:       ${env.ALGORAND_INDEXER_URL}`);
  logger.info(`Receiver:      ${isReceiverConfigured ? 'CONFIGURED' : 'CONFIGURATION REQUIRED'}`);
  logger.info(`Agent Payer:   ${isPayerConfigured ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
  logger.info(`Paid Endpoint: ENABLED (${env.X402_ENDPOINT})`);
  logger.info(`----------------------------------------------------`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default server;
