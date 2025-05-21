

const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
// in authRoutes.js
router.get('/test', (req, res) => {
  res.json({ success: true });
});


module.exports = router;
