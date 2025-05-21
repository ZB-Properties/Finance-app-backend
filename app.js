
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const path = require('path');



const app = express();

const allowedOrigins = [
  'http://localhost:2600', 
  'https://financetracks-app.netlify.app' 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(express.static(path.join(__dirname, 'public')));



module.exports = app;
