import request from 'supertest';
import { createApp } from '../src/app';

describe('Official x402 Protected Endpoint - GET /api/paid/supplier-intelligence', () => {
  const app = createApp();

  it('should return HTTP 402 Payment Required when payment has not been provided', async () => {
    const res = await request(app)
      .get('/api/paid/supplier-intelligence')
      .expect(402);

    expect(res.status).toBe(402);
    const header = res.headers['payment-required'] as string;
    expect(header).toBeDefined();
    expect(typeof header).toBe('string');
    expect(header.length).toBeGreaterThan(10);

    const decoded = JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
    expect(decoded.accepts || decoded.paymentId || decoded.network).toBeDefined();
  });

  it('should return HTTP 402 with official base64 header payload', async () => {
    const res = await request(app)
      .get('/api/paid/supplier-intelligence?hospitalId=hospital-test-01')
      .expect(402);

    const header = res.headers['payment-required'] as string;
    expect(header).toBeDefined();
    expect(typeof header).toBe('string');
    expect(header.length).toBeGreaterThan(10);
  });

  it('should reject invalid or forged payment signature', async () => {
    const forgedSignature = Buffer.from(
      JSON.stringify({
        x402Version: 2,
        payload: {
          paymentGroup: []
        }
      })
    ).toString('base64');

    const res = await request(app)
      .get('/api/paid/supplier-intelligence')
      .set('PAYMENT-SIGNATURE', forgedSignature)
      .expect(402);

    expect(res.status).toBe(402);
  });

  it('should serve public health check at GET /health and GET /api/health without payment', async () => {
    const rootHealth = await request(app).get('/health').expect(200);
    expect(rootHealth.body.status).toBe('ok');

    const apiHealth = await request(app).get('/api/health').expect(200);
    expect(apiHealth.body.status).toBe('ok');
  });
});

