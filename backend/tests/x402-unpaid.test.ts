import request from 'supertest';
import { createApp } from '../src/app';
import { ALGORAND_TESTNET_CAIP2 } from '../src/config/constants';

describe('Test 1 — Unpaid Resource (x402 Protocol)', () => {
  const app = createApp();

  it('should return HTTP 402 Payment Required on GET /api/paid/supplier-intelligence without payment', async () => {
    const res = await request(app)
      .get('/api/paid/supplier-intelligence')
      .expect(402);

    expect(res.status).toBe(402);

    const paymentRequiredHeader = res.headers['payment-required'] as string;
    expect(paymentRequiredHeader).toBeDefined();
    expect(typeof paymentRequiredHeader).toBe('string');
    expect(paymentRequiredHeader.length).toBeGreaterThan(10);

    const decoded = JSON.parse(Buffer.from(paymentRequiredHeader, 'base64').toString('utf8'));
    expect(decoded.x402Version).toBe(2);
    expect(decoded.accepts).toBeDefined();
    expect(Array.isArray(decoded.accepts)).toBe(true);

    const avmAccept = decoded.accepts.find((a: any) => a.network === ALGORAND_TESTNET_CAIP2);
    expect(avmAccept).toBeDefined();
    expect(avmAccept.scheme).toBe('exact');
  });

  it('should return HTTP 402 on POST /api/paid/supplier-intelligence without payment', async () => {
    const res = await request(app)
      .post('/api/paid/supplier-intelligence')
      .send({ category: 'medical-supplies' })
      .expect(402);

    expect(res.status).toBe(402);
    expect(res.headers['payment-required']).toBeDefined();
  });
});
