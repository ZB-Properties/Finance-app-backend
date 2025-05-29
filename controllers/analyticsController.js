const pool = require('../models/db');


const getSummary = async (req, res) => {
  const userId = req.user?.userId;

  console.log('Fetching summary for user:', userId); 

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

    const categoryResult = await pool.query(
      `SELECT "category", SUM(amount) AS total
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       GROUP BY "category" 
       ORDER BY total DESC`,
      [userId]
    );

const budgetsResult = await pool.query(
      `SELECT category, amount, (
         SELECT COALESCE(SUM(t.amount), 0)
         FROM transactions t
         WHERE t.user_id = $1 AND t.category = b.category AND t.type = 'expense'
       ) AS spent
       FROM budgets b
       WHERE user_id = $1`,
      [userId]
    );

    const totalIncome = parseFloat(incomeResult.rows[0].total_income);
    const totalExpense = parseFloat(expenseResult.rows[0].total_expense);

    const categoryTotals = {};
    categoryResult.rows.forEach(row => {
      categoryTotals[row.category] = parseFloat(row.total);
    });

    const budgets = budgetsResult.rows;

    res.json({
      totalIncome,
      totalExpense,
      categoryTotals,
      budgets
    });
  } catch (err) {
    console.error('Error in getSummary:', err);
    res.status(500).json({ message: 'Failed to load summary' })
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
    console.error(err);
    
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
    console.error(err);
    res.status(500).json({ message: 'Failed to load monthly trends' });
  }
};

const generateMonthlyAnalytics = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(date, 'YYYY-MM') AS month,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS balance
       FROM transactions
       WHERE user_id = $1
       GROUP BY month
       ORDER BY month DESC
       LIMIT 1`,
      [userId]
    );

    const { month, total_income, total_expense, balance } = result.rows[0];

    await pool.query(
      `INSERT INTO analytics (user_id, month, total_income, total_expense, balance)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, month)
       DO UPDATE SET total_income = $3, total_expense = $4, balance = $5`,
      [userId, month, total_income, total_expense, balance]
    );

    res.json({ message: 'Analytics updated', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Analytics update failed' });
  }
};

module.exports = {
  getSummary,
  getByCategory,
  getMonthlyTrend,
  generateMonthlyAnalytics,
};
