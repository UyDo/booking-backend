const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, role FROM staff');
  res.json(rows);
});

module.exports = router;
