const request = require('supertest');
const app = require('../../app');

let authToken = '';

const getAuthToken = async () => {
  if (!authToken) {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'password123'
    });
    authToken = res.body.token;
  }
  return authToken;
};

module.exports = { getAuthToken };
