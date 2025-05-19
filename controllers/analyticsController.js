
const pool = require('../models/db');


const getSummary = async (req, res) => {
  const userId = req.user.userId;

  try {
    const incomeResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_income
       FROM transactions WHERE user_id = $1 AND type = 'income'`,
      [userId]
    );

    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_expense
       FROM transactions WHERE user_id = $1 AND type = 'expense'`,
      [userId]
    );

    const income = parseFloat(incomeResult.rows[0].total_income);
    const expenses = parseFloat(expenseResult.rows[0].total_expense);
    const balance = income - expenses;

    res.json({ income, expenses, balance });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load summary', error: err.message });
  }
};


const getByCategory = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       GROUP BY category ORDER BY total DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load category breakdown', error: err.message });
  }
};


const getMonthlyTrend = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(date, 'YYYY-MM') AS month,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
       FROM transactions
       WHERE user_id = $1
       GROUP BY month
       ORDER BY month DESC
       LIMIT 12`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load monthly trends', error: err.message });
  }
};

module.exports = {
  getSummary,
  getByCategory,
  getMonthlyTrend,
};
