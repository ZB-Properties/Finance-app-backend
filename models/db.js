
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


pool.on('connect', () => {
  console.log("Connecting to:", process.env.DATABASE_URL);
});

module.exports = pool;
