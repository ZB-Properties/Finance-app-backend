
const pool = require('../models/db');


const addBudget = async (req, res) => {
  const { month, year, amount } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `INSERT INTO budgets (user_id, month, year, amount)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, month, year, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add budget' });
  }
};


const getBudgets = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM budgets WHERE user_id = $1 ORDER BY year DESC, month DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
};


const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { month, year, amount } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `UPDATE budgets
       SET month = $1, year = $2, amount = $3
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [month, year, amount, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update budget' });
  }
};


const deleteBudget = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete budget' });
  }
};

module.exports = {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
