const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const OTP_TTL = parseInt(process.env.OTP_TTL_SECONDS || '300', 10);

async function createAndSendOTP({ userId, phone }) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  const id = uuidv4();
  const expiresAt = new Date(Date.now() + OTP_TTL * 1000);

  await db.query(
    `INSERT INTO otps (id, user_id, otp, expires_at, created_at) VALUES ($1, $2, $3, $4, now())`,
    [id, userId, otp, expiresAt]
  );

  // TODO: integrate Twilio/Send SMS
  console.log(`DEBUG OTP for user ${userId} (${phone}): ${otp}`);

  return { id, otp };
}

async function verifyOTP({ userId, otp }) {
  const { rows } = await db.query(
    `SELECT id, otp, expires_at FROM otps WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  if (!rows.length) return false;
  const record = rows[0];
  const expired = new Date(record.expires_at) < new Date();
  if (expired) return false;
  if (record.otp !== otp) return false;

  // Optionally: delete or mark used
  await db.query(`DELETE FROM otps WHERE id=$1`, [record.id]);
  return true;
}

module.exports = { createAndSendOTP, verifyOTP };
