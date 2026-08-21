import http from 'http';
import { createApp } from '../app';

async function testUnpaidRequest() {
  console.log('\n===============================================================');
  console.log('🔍 MEDMATCH AI — TESTING UNPAID x402 REQUEST');
  console.log('===============================================================\n');

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address: any = server.address();
  const port = address.port;

  try {
    const url = `http://localhost:${port}/api/paid/supplier-intelligence`;
    console.log(`Sending GET request to ${url}...`);

    const res = await fetch(url);
    const paymentRequiredHeader = res.headers.get('PAYMENT-REQUIRED') || res.headers.get('payment-required');

    console.log(`\nHTTP Status: ${res.status} ${res.statusText}`);
    console.log(`PAYMENT-REQUIRED Header: ${paymentRequiredHeader ? `${paymentRequiredHeader.slice(0, 50)}...` : 'MISSING'}`);

    if (res.status === 402 && paymentRequiredHeader) {
      const decoded = JSON.parse(Buffer.from(paymentRequiredHeader, 'base64').toString('utf8'));
      console.log('\n✓ Decoded Payment Requirements:');
      console.log(JSON.stringify(decoded, null, 2));
      console.log('\n🎉 SUCCESS: Genuine HTTP 402 Payment Required challenge confirmed!');
    } else {
      console.error('\n❌ FAILED: Did not receive expected 402 challenge with valid headers.');
      process.exit(1);
    }
  } finally {
    server.close();
  }
}

testUnpaidRequest().catch((err) => {
  console.error('Error testing unpaid request:', err);
  process.exit(1);
});
