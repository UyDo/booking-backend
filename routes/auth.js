const express = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * REGISTER
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    const [exists] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (exists.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?, ?)",
      [full_name, email, hashed, role]
    );

    res.json({ id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register failed" });
  }
});


/**
 * LOGIN
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
	const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows || result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

	const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.name
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;

