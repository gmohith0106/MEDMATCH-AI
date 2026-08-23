import dotenv from 'dotenv';
import { z } from 'zod';

export const ALGORAND_TESTNET_CAIP2 = 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe';
export const ALGORAND_MAINNET_CAIP2 = 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k';

dotenv.config();

const envSchema = z.object({
  // Core Server
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('https://frontend-ay0rbek93-gmohith0106s-projects.vercel.app'),

  // Execution Modes
  PAYMENT_MODE: z.enum(['x402', 'mock']).default('x402'),
  ALGORAND_MODE: z.enum(['real', 'mock']).default('real'),
  DEMO_MODE: z
    .string()
    .default('false')
    .transform((val) => val.toLowerCase() === 'true'),

  // Firebase Admin SDK (Backend / Server-Side only)
  FIREBASE_PROJECT_ID: z.string().optional().default('medmatch-ai'),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_DATABASE_URL: z
    .string()
    .default('https://medmatch-ai-dbd96-default-rtdb.asia-southeast1.firebasedatabase.app'),

  // Firebase Emulators (Optional for local testing)
  FIREBASE_DATABASE_EMULATOR_HOST: z.string().optional(),
  FIRESTORE_EMULATOR_HOST: z.string().optional(),
  FIREBASE_AUTH_EMULATOR_HOST: z.string().optional(),

  // x402 Protocol Configuration
  X402_ENDPOINT: z.string().default('/api/paid/supplier-intelligence'),
  X402_FACILITATOR_URL: z.string().default('https://facilitator.goplausible.xyz'),
  X402_API_KEY: z.string().optional(),
  X402_PAYMENT_AMOUNT: z.string().default('$0.001'),
  X402_PAYMENT_ASSET: z.string().default('USDC'),

  // Algorand Node & Indexer Configuration
  ALGORAND_NETWORK: z.string().default(ALGORAND_TESTNET_CAIP2),
  ALGORAND_ALGOD_SERVER: z.string().optional(),
  ALGORAND_NODE_URL: z.string().default('https://testnet-api.algonode.cloud'),
  ALGORAND_INDEXER_SERVER: z.string().optional(),
  ALGORAND_INDEXER_URL: z.string().default('https://testnet-idx.algonode.cloud'),
  ALGORAND_PORT: z.string().default('443'),
  ALGORAND_API_TOKEN: z.string().default(''),
  ALGORAND_RECEIVER_ADDRESS: z.string().default(''),
  ALGORAND_SENDER_MNEMONIC: z.string().optional(),
  ALGORAND_EXPLORER_BASE_URL: z.string().default('https://lora.algokit.io/testnet/transaction'),

  // Twilio SMS Integration (Optional)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional()
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('\n❌ [Configuration Error] Invalid or missing environment variable(s):');
    result.error.issues.forEach((issue) => {
      const varName = issue.path.join('.');
      console.error(`   - Variable: ${varName}`);
      console.error(`     Issue:    ${issue.message}`);
    });
    console.error('\nPlease verify your backend/.env configuration file before starting.\n');
    throw new Error(`Environment configuration validation failed: ${result.error.issues.map(i => i.path.join('.')).join(', ')}`);
  }

  const data = result.data;

  // Resolve Aliases
  if (process.env.AVM_MNEMONIC && !data.ALGORAND_SENDER_MNEMONIC) {
    data.ALGORAND_SENDER_MNEMONIC = process.env.AVM_MNEMONIC;
  }
  if (process.env.AVM_ADDRESS && !data.ALGORAND_RECEIVER_ADDRESS) {
    data.ALGORAND_RECEIVER_ADDRESS = process.env.AVM_ADDRESS;
  }
  if (process.env.FACILITATOR_URL && !process.env.X402_FACILITATOR_URL) {
    data.X402_FACILITATOR_URL = process.env.FACILITATOR_URL;
  }
  if (process.env.X402_PAYMENT_PRICE && !process.env.X402_PAYMENT_AMOUNT) {
    const rawPrice = process.env.X402_PAYMENT_PRICE.trim();
    data.X402_PAYMENT_AMOUNT = rawPrice.startsWith('$') ? rawPrice : `$${rawPrice}`;
  }
  if (data.ALGORAND_ALGOD_SERVER && !process.env.ALGORAND_NODE_URL) {
    data.ALGORAND_NODE_URL = data.ALGORAND_ALGOD_SERVER;
  }
  if (data.ALGORAND_INDEXER_SERVER && !process.env.ALGORAND_INDEXER_URL) {
    data.ALGORAND_INDEXER_URL = data.ALGORAND_INDEXER_SERVER;
  }

  return data;
};

export const env = parseEnv();
export type Env = typeof env;

/**
 * Safe Startup Configuration Audit & Diagnostics
 * Validates required parameters and prints clean status lines without leaking secrets.
 */
export function validateStartupConfig(): void {
  const { getAlgorandAccountFromMnemonic } = require('../utils/algorand-wallet');

  console.log('\n======================================================');
  console.log('🏥 MEDMATCH AI — STARTUP CONFIGURATION AUDIT');
  console.log('======================================================');

  // 1. Validate Payer Signer (Account 1)
  const payerAccount = getAlgorandAccountFromMnemonic(env.ALGORAND_SENDER_MNEMONIC);
  const payerStatus = payerAccount ? 'CONFIGURED' : 'NOT CONFIGURED';

  // 2. Validate Receiver (Account 2)
  const isReceiverValid = Boolean(
    env.ALGORAND_RECEIVER_ADDRESS &&
    env.ALGORAND_RECEIVER_ADDRESS.length === 58 &&
    !env.ALGORAND_RECEIVER_ADDRESS.includes('YOUR_') &&
    !env.ALGORAND_RECEIVER_ADDRESS.includes('ACCOUNT_2_')
  );
  const receiverStatus = isReceiverValid ? 'CONFIGURED' : 'NOT CONFIGURED';

  // 3. Network, Facilitator, Price
  const networkName = env.ALGORAND_NETWORK.toLowerCase().includes('mainnet') ? 'MAINNET' : 'TESTNET';
  const facilitatorStatus = env.X402_FACILITATOR_URL ? 'CONFIGURED' : 'NOT CONFIGURED';
  const priceDisplay = `${env.X402_PAYMENT_AMOUNT.replace('$', '')} ${env.X402_PAYMENT_ASSET}`;

  console.log(`Payer signer ........ ${payerStatus}`);
  console.log(`Receiver ............ ${receiverStatus}`);
  console.log(`Algorand network .... ${networkName}`);
  console.log(`GoPlausible ......... ${facilitatorStatus}`);
  console.log(`x402 price .......... ${priceDisplay}`);
  console.log('======================================================\n');
}

