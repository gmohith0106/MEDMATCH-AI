import http from 'http';
import { createApp } from '../app';
import { X402BuyerClientService } from '../services/payments/buyer-client.service';
import { env } from '../config/env';

async function testPaidFlow() {
  console.log('\n===============================================================');
  console.log('💳 MEDMATCH AI — TESTING AUTONOMOUS PAID x402 PROTOCOL FLOW');
  console.log('===============================================================\n');

  const buyerClient = X402BuyerClientService.getInstance();
  const isPayerConfigured = buyerClient.isSignerConfigured();

  if (!isPayerConfigured) {
    console.log('ℹ️ Autonomous payer wallet mnemonic is not configured in .env (ALGORAND_SENDER_MNEMONIC).');
    console.log('To execute real on-chain payment tests, configure disposable TestNet payer mnemonic.');
    console.log('\nTesting unpaid handshake to verify 402 challenge...');
  }

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address: any = server.address();
  const port = address.port;

  try {
    const targetUrl = `http://localhost:${port}/api/paid/supplier-intelligence`;
    const result = await buyerClient.purchaseSupplierIntelligence({
      hospitalId: 'hospital-citycare-001',
      userId: 'test-buyer',
      procurementRunId: `cli-test-${Date.now().toString(36)}`,
      targetUrl
    });

    console.log('\nResult Status Code:', result.statusCode);
    console.log('Spend Policy Decision:', result.spendDecision?.decision);
    console.log('Spend Reason:', result.spendDecision?.reason);

    if (result.success) {
      console.log('\n🎉 SUCCESS: x402 payment settled and resource unlocked!');
      console.log(`- Transaction ID: ${result.transactionId}`);
      console.log(`- Payer Address:  ${result.payerAddress}`);
      console.log(`- Receiver:       ${result.receiverAddress}`);
      console.log(`- Explorer URL:   ${result.explorerUrl}`);
      console.log(`- Suppliers Returned: ${result.data?.suppliers?.length || 0}`);
    } else {
      console.log(`\nStatus: ${result.statusCode} (${result.error || 'Challenge Received'})`);
      console.log(`Message: ${result.message}`);
    }
  } finally {
    server.close();
  }
}

testPaidFlow().catch((err) => {
  console.error('Error running paid test:', err);
  process.exit(1);
});
