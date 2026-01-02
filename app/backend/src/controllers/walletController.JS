// backend/src/controllers/walletController.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const walletService = require('../services/walletService');

// GET /wallet - get balance
router.get('/', auth, async (req, res) => {
  try {
    const result = await walletService.getBalance(req.userId);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
});

// POST /wallet/topup - faucet/top-up (dev only)
router.post('/topup', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) return res.status(400).json({ error: 'invalid_amount' });
    const result = await walletService.topUp({ userId: req.userId, amount });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message || 'server_error' });
  }
});

// POST /wallet/transfer - transfer to phone or userId
router.post('/transfer', auth, async (req, res) => {
  try {
    const { to, amount } = req.body;
    if (!to || !amount) return res.status(400).json({ error: 'to_and_amount_required' });
    const result = await walletService.transfer({ fromUserId: req.userId, toPhoneOrUserId: to, amount });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message || 'server_error' });
  }
});

// GET /wallet/transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const offset = parseInt(req.query.offset || '0', 10);
    const txs = await walletService.listTransactions({ userId: req.userId, limit, offset });
    return res.json({ transactions: txs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
