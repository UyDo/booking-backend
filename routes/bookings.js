const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/bookings
router.get('/', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM bookings ORDER BY start_at DESC LIMIT 100');
  res.json(rows);
});

// POST /api/bookings
router.post('/', auth, async (req, res) => {
  const { customer_id, staff_id, service_id, start_at, duration_min } = req.body;
  const [result] = await pool.query(
    'INSERT INTO bookings (customer_id, staff_id, service_id, start_at, duration_min, status) VALUES (?, ?, ?, ?, ?, ?)',
    [customer_id, staff_id, service_id, start_at, duration_min, 'pending']
  );
  res.json({ id: result.insertId });
});

module.exports = router;
