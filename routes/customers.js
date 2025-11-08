const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, phone, email FROM customers ORDER BY id DESC LIMIT 200');
  res.json(rows);
});

module.exports = router;
