const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpService = require('../services/otpService');

// Simple register: phone + name
router.post('/register', async (req, res) => {
  const { phone, name } = req.body;
  if (!phone) return res.status(400).json({ error: 'phone required' });

  try {
    // Check existing
    const { rows } = await db.query('SELECT id, phone, verified FROM users WHERE phone=$1', [phone]);
    if (rows.length) {
      // if already verified, just return "already registered" or trigger OTP again
      const user = rows[0];
      if (user.verified) {
        return res.status(200).json({ message: 'already_registered', userId: user.id });
      }
    }

    // Create or upsert user
    let userId;
    if (rows.length === 0) {
      const r = await db.query(
        `INSERT INTO users (name, phone, verified, created_at) VALUES ($1, $2, false, now()) RETURNING id`,
        [name || null, phone]
      );
      userId = r.rows[0].id;
    } else {
      userId = rows[0].id;
    }

    // Create and send OTP
    const otp = await otpService.createAndSendOTP({ userId, phone });
    res.json({ message: 'otp_sent', otpSent: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) return res.status(400).json({ error: 'userId and otp required' });

  try {
    const valid = await otpService.verifyOTP({ userId, otp });
    if (!valid) return res.status(400).json({ error: 'invalid_otp' });

    // mark user verified
    await db.query('UPDATE users SET verified=true WHERE id=$1', [userId]);

    // issue JWT
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP || '7d' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
