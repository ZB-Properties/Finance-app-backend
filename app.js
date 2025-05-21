
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const path = require('path');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(express.static(path.join(__dirname, 'public')));



module.exports = app;
