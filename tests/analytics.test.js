const request = require('supertest');
const app = require('../app');
const pool = require('../models/db');
const { getAuthToken } = require('./utils/testUtils');

beforeAll(async () => {
  await pool.query('DELETE FROM transactions');

  const token = await getAuthToken();

  await request(app)
    .post('/api/transactions')
    .set('Authorization', `Bearer ${token}`)
    .send({
      type: 'income',
      category: 'Salary',
      amount: 3000,
      description: 'Monthly salary',
      date: '2025-05-01'
    });

  await request(app)
    .post('/api/transactions')
    .set('Authorization', `Bearer ${token}`)
    .send({
      type: 'expense',
      category: 'Food',
      amount: 200,
      description: 'Groceries',
      date: '2025-05-02'
    });

  await request(app)
    .post('/api/transactions')
    .set('Authorization', `Bearer ${token}`)
    .send({
      type: 'expense',
      category: 'Transport',
      amount: 100,
      description: 'Bus ticket',
      date: '2025-05-03'
    });
});

afterAll(async () => {
  await pool.end();
});

describe('Analytics API', () => {
  test('GET /api/analytics/summary', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('income');
    expect(res.body).toHaveProperty('expenses');
    expect(res.body).toHaveProperty('balance');
    expect(res.body.income).toBeGreaterThan(0);
  });

  test('GET /api/analytics/by-category', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/analytics/by-category')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('category');
    expect(res.body[0]).toHaveProperty('total');
  });

  test('GET /api/analytics/by-month', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/analytics/by-month')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('month');
    expect(res.body[0]).toHaveProperty('income');
    expect(res.body[0]).toHaveProperty('expense');
  });
});
