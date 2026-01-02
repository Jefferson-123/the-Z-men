// backend/src/services/walletService.js
const db = require('../db');

async function getOrCreateWalletForUser(userId) {
  // Try to fetch first
  const { rows } = await db.query(`SELECT * FROM wallets WHERE user_id=$1`, [userId]);
  if (rows.length) return rows[0];

  const r = await db.query(
    `INSERT INTO wallets (user_id, balance, currency, created_at) VALUES ($1, 0.00, 'ZMW', now()) RETURNING *`,
    [userId]
  );
  return r.rows[0];
}

async function getWalletByUserId(userId) {
  const { rows } = await db.query(`SELECT * FROM wallets WHERE user_id=$1`, [userId]);
  return rows[0] ?? null;
}

// Get wallet balance (ensures wallet exists)
async function getBalance(userId) {
  const wallet = await getOrCreateWalletForUser(userId);
  return { walletId: wallet.id, balance: wallet.balance, currency: wallet.currency };
}

// Faucet/top-up (for development/testing). Atomically increment.
async function topUp({ userId, amount, metadata = {} }) {
  if (amount <= 0) throw new Error('invalid_amount');

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // ensure wallet exists
    const { rows: wRows } = await client.query(`SELECT * FROM wallets WHERE user_id=$1 FOR UPDATE`, [userId]);
    let wallet;
    if (wRows.length === 0) {
      const r = await client.query(
        `INSERT INTO wallets (user_id, balance, currency, created_at) VALUES ($1, 0.00, 'ZMW', now()) RETURNING *`,
        [userId]
      );
      wallet = r.rows[0];
    } else {
      wallet = wRows[0];
    }

    const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toFixed(2);
    await client.query(
      `UPDATE wallets SET balance = $1 WHERE id = $2`,
      [newBalance, wallet.id]
    );

    await client.query(
      `INSERT INTO transactions (wallet_id, type, amount, currency, metadata, created_at)
       VALUES ($1, 'topup', $2, $3, $4::jsonb, now())`,
      [wallet.id, amount, wallet.currency, JSON.stringify(metadata)]
    );

    await client.query('COMMIT');

    return { walletId: wallet.id, balance: newBalance };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Transfer between users (internal). debits sender, credits recipient atomically.
async function transfer({ fromUserId, toPhoneOrUserId, amount, metadata = {} }) {
  if (amount <= 0) throw new Error('invalid_amount');

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // find recipient user & wallet
    // toPhoneOrUserId might be phone string or user id; try to detect format
    let recipientUserId = null;
    if (/^\+?\d+$/.test(String(toPhoneOrUserId))) {
      // looks like phone
      const r = await client.query(`SELECT id FROM users WHERE phone=$1 LIMIT 1`, [toPhoneOrUserId]);
      if (!r.rows.length) throw new Error('recipient_not_found');
      recipientUserId = r.rows[0].id;
    } else {
      // treat as user id
      recipientUserId = toPhoneOrUserId;
    }

    if (recipientUserId === fromUserId) throw new Error('cannot_transfer_to_self');

    // lock sender wallet
    const { rows: sRows } = await client.query(`SELECT * FROM wallets WHERE user_id=$1 FOR UPDATE`, [fromUserId]);
    if (!sRows.length) throw new Error('sender_wallet_not_found');
    const senderWallet = sRows[0];

    // check funds
    if (parseFloat(senderWallet.balance) < parseFloat(amount)) throw new Error('insufficient_funds');

    // lock or create recipient wallet
    let recipientWallet;
    const { rows: rRows } = await client.query(`SELECT * FROM wallets WHERE user_id=$1 FOR UPDATE`, [recipientUserId]);
    if (rRows.length === 0) {
      const rr = await client.query(
        `INSERT INTO wallets (user_id, balance, currency, created_at) VALUES ($1, 0.00, 'ZMW', now()) RETURNING *`,
        [recipientUserId]
      );
      recipientWallet = rr.rows[0];
    } else {
      recipientWallet = rRows[0];
    }

    // perform updates
    const newSenderBal = (parseFloat(senderWallet.balance) - parseFloat(amount)).toFixed(2);
    const newRecipientBal = (parseFloat(recipientWallet.balance) + parseFloat(amount)).toFixed(2);

    await client.query(`UPDATE wallets SET balance=$1 WHERE id=$2`, [newSenderBal, senderWallet.id]);
    await client.query(`UPDATE wallets SET balance=$1 WHERE id=$2`, [newRecipientBal, recipientWallet.id]);

    // ledger entries
    await client.query(
      `INSERT INTO transactions (wallet_id, type, amount, currency, metadata, created_at)
       VALUES ($1, 'transfer_sent', $2, $3, $4::jsonb, now())`,
      [senderWallet.id, amount, senderWallet.currency, JSON.stringify({ ...metadata, toUserId: recipientUserId })]
    );

    await client.query(
      `INSERT INTO transactions (wallet_id, type, amount, currency, metadata, created_at)
       VALUES ($1, 'transfer_received', $2, $3, $4::jsonb, now())`,
      [recipientWallet.id, amount, recipientWallet.currency, JSON.stringify({ ...metadata, fromUserId: fromUserId })]
    );

    await client.query('COMMIT');

    return {
      from: { walletId: senderWallet.id, balance: newSenderBal },
      to: { walletId: recipientWallet.id, balance: newRecipientBal }
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// list transactions for a user's wallet
async function listTransactions({ userId, limit = 50, offset = 0 }) {
  const { rows: wRows } = await db.query(`SELECT * FROM wallets WHERE user_id=$1`, [userId]);
  if (!wRows.length) return [];
  const walletId = wRows[0].id;
  const { rows } = await db.query(
    `SELECT id, type, amount, currency, metadata, created_at FROM transactions
     WHERE wallet_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [walletId, limit, offset]
  );
  return rows;
}

module.exports = { getOrCreateWalletForUser, getWalletByUserId, getBalance, topUp, transfer, listTransactions };
