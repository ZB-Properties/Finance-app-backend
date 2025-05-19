
const express = require('express');
const router = express.Router();
const {
  getSummary,
  getByCategory,
  getMonthlyTrend,
} = require('../controllers/analyticsController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/by-month', getMonthlyTrend);

module.exports = router;
