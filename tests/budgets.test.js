const request = require('supertest');
const app = require('../app');
const pool = require('../models/db');
const { getAuthToken } = require('./utils/testUtils');

let budgetId;

beforeAll(async () => {
  await pool.query('DELETE FROM budgets');
});

afterAll(async () => {
  await pool.end();
});

describe('Budgets API', () => {
  test('Create Budget - POST /api/budgets', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        month: 'May',
        year: 2025,
        amount: 1200
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(1200);
    expect(res.body.month).toBe('May');

    budgetId = res.body.id;
  });

  test('Get Budgets - GET /api/budgets', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .get('/api/budgets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('month');
    expect(res.body[0]).toHaveProperty('year');
  });

  test('Update Budget - PUT /api/budgets/:id', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .put(`/api/budgets/${budgetId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        month: 'June',
        year: 2025,
        amount: 1500
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(1500);
    expect(res.body.month).toBe('June');
  });

  test('Delete Budget - DELETE /api/budgets/:id', async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .delete(`/api/budgets/${budgetId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Budget deleted' });
  });
});
