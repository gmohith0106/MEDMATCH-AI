import request from 'supertest';
import { createApp } from '../src/app';

describe('Hospital Directory Dataset Endpoints (30,273 records)', () => {
  const app = createApp();

  it('GET /api/hospitals - should return paginated list of authoritative hospital records', async () => {
    const res = await request(app).get('/api/hospitals?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBeGreaterThanOrEqual(30000);
    expect(res.body.data.hospitals).toHaveLength(5);
    expect(res.body.data.source).toBe('Hospital Directory Dataset');

    const first = res.body.data.hospitals[0];
    expect(first).toHaveProperty('hospitalName');
    expect(first).toHaveProperty('state');
    expect(first).toHaveProperty('district');
    expect(first).toHaveProperty('totalNumBeds');
  });

  it('GET /api/hospitals/filters - should return available dropdown filters', async () => {
    const res = await request(app).get('/api/hospitals/filters');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.states.length).toBeGreaterThan(10);
    expect(res.body.data.careTypes.length).toBeGreaterThan(0);
  });

  it('GET /api/hospitals/:id - should return single authoritative record with normalized fields', async () => {
    const res = await request(app).get('/api/hospitals/hosp-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hospitalName).toBeDefined();
    expect(res.body.data.source).toBe('Hospital Directory Dataset');
  });

  it('GET /api/hospitals - should filter by search and state query parameters', async () => {
    const res = await request(app).get('/api/hospitals?search=Hospital&state=Delhi&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.hospitals)).toBe(true);
  });
});
