
const request = require('supertest');
const app = require('../app');
const pool = require('../models/db');

beforeAll(async () => {
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});

describe('Auth Endpoints', () => {
  test('Signup - POST /api/auth/signup', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test('Login - POST /api/auth/login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
