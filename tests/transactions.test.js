const request = require('supertest');
const app = require('../app');
const pool = require('../models/db');
const { getAuthToken } = require('./utils/testUtils');

let transactionId;

beforeAll(async () => {
  await pool.query('DELETE FROM transactions');
});

afterAll(async () => {
  await pool.end();
});

describe('Transactions API', () => {
  test('Create Transaction', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'expense',
        category: 'Food',
        amount: 50,
        description: 'Lunch',
        date: '2025-05-18'
      });

    expect(res.statusCode).toBe(201);
    transactionId = res.body.id;
  });

  test('Get Transactions', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Update Transaction', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .put(`/api/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'expense',
        category: 'Groceries',
        amount: 100,
        description: 'Dinner',
        date: '2025-05-19'
      });
    expect(res.statusCode).toBe(200);
  });

  test('Delete Transaction', async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
