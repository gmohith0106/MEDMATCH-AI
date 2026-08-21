import request from 'supertest';
import { createApp } from '../src/app';

describe('Test 4 — Invalid or Tampered Payment Proof Rejection', () => {
  const app = createApp();

  it('should reject malformed or fake PAYMENT-SIGNATURE', async () => {
    const fakeSignature = Buffer.from(
      JSON.stringify({
        x402Version: 2,
        payload: {
          paymentGroup: ['fake_base64_tx'],
          paymentIndex: 0
        }
      })
    ).toString('base64');

    const res = await request(app)
      .get('/api/paid/supplier-intelligence')
      .set('PAYMENT-SIGNATURE', fakeSignature)
      .expect(402);

    expect(res.status).toBe(402);
  });

  it('should reject random non-base64 signature strings', async () => {
    const res = await request(app)
      .get('/api/paid/supplier-intelligence')
      .set('PAYMENT-SIGNATURE', 'invalid-random-header-content-12345')
      .expect(402);

    expect(res.status).toBe(402);
  });
});
