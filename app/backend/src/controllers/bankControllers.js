const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');
const { getProviderForBank } = require('../services/banks/providerFactory');
const providerFactory = require('../services/banks/providerFactory');

// List banks by country/region
router.get('/list', auth, async (req, res) => {
  const country = req.query.country || 'ZM';
  try {
    // For mock provider we call static method
    const banks = await require('../services/banks/providers/mockBankProvider').listBanksByCountry(country);
    return res.json({ banks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
});

// Link bank account (verify)
router.post('/link', auth, async (req, res) => {
  try {
    const { bank_code, bank_name, account_number, country } = req.body;
    if (!bank_code || !account_number) return res.status(400).json({ error: 'missing_fields' });

    // Verify via provider
    const provider = getProviderForBank(bank_code);
    const ver = await provider.verifyAccount({ accountNumber: account_number, bankCode: bank_code, country });
    if (!ver || !ver.success) return res.status(400).json({ error: 'bank_verification_failed' });

    const { rows } = await db.query(
      `INSERT INTO bank_accounts (user_id, bank_code, bank_name, account_number, account_name, country, metadata, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb, now()) RETURNING *`,
      [req.userId, bank_code, bank_name || null, account_number, ver.account_name || null, country || null, JSON.stringify({ verified: true })]
    );

    return res.json({ bankAccount: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'server_error' });
  }
});

/**
 * DEPOSIT FROM BANK
 * Flow (user clicks "Deposit from Bank" -> choose bank -> start deposit):
 *  - create bank_transactions record status=pending
 *  - call provider.debit(...) to initiate debit from user's bank (or rely on external webhook)
 *  - on success: credit wallet (topUp) and mark bank_transaction success with external id
 */
router.post('/deposit', auth, async (req, res) => {
  try {
    const { bank_account_id, amount } = req.body;
    if (!bank_account_id || !amount) return res.status(400).json({ error: 'missing_fields' });

    // fetch bank account
    const { rows: accRows } = await db.query('SELECT * FROM bank_accounts WHERE id=$1 AND user_id=$2', [bank_account_id, req.userId]);
    if (!accRows.length) return res.status(404).json({ error: 'bank_account_not_found' });
    const bankAccount = accRows[0];

    // create pending transaction
    const { rows: txRows } = await db.query(
      `INSERT INTO bank_transactions (user_id, type, amount, currency, status, bank_account_id, metadata, created_at)
       VALUES ($1,'deposit_from_bank',$2,'ZMW','pending',$3,$4::jsonb, now()) RETURNING *`,
      [req.userId, amount, bank_account_id, JSON.stringify({ initiated_at: new Date().toISOString() })]
    );
    const bankTx = txRows[0];

    // call provider to debit
    const provider = getProviderForBank(bankAccount.bank_code);
    const result = await provider.debit({ bankAccount, amount, reference: bankTx.id });

    if (result && result.success) {
      // credit wallet (use walletService.topUp)
      const walletService = require('../services/walletService');
      await walletService.topUp({ userId: req.userId, amount, metadata: { source: 'bank', bankTxId: bankTx.id, externalId: result.externalId } });

      // update bank transaction to success
      await db.query(`UPDATE bank_transactions SET status='success', metadata = $1::jsonb WHERE id=$2`, [JSON.stringify({ ...bankTx.metadata, externalId: result.externalId, resultMessage: result.message }), bankTx.id]);

      return res.json({ success: true, bankTxId: bankTx.id });
    } else {
      await db.query(`UPDATE bank_transactions SET status='failed', metadata = $1::jsonb WHERE id=$2`, [JSON.stringify({ ...bankTx.metadata, result }), bankTx.id]);
      return res.status(400).json({ error: 'bank_debit_failed' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'server_error' });
  }
});

/**
 * WITHDRAW TO BANK
 * Flow:
 *  - choose source: wallet or another bank (if another bank, source bank must be linked)
 *  - choose destination bank account to send to
 *  - if source(wallet): debit wallet (atomic), then call provider.credit(...) to send to bank
 *  - if source(bank): perform bank-to-bank transfer (not covered; mock by debit from source bank and credit to dest bank)
 */
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { source, source_bank_account_id, dest_bank_account_id, amount } = req.body;
    if (!source || !dest_bank_account_id || !amount) return res.status(400).json({ error: 'missing_fields' });

    // fetch destination account
    const { rows: destRows } = await db.query('SELECT * FROM bank_accounts WHERE id=$1', [dest_bank_account_id]);
    if (!destRows.length) return res.status(404).json({ error: 'destination_not_found' });
    const destAccount = destRows[0];

    // create pending bank transaction
    const { rows: txRows } = await db.query(
      `INSERT INTO bank_transactions (user_id, type, amount, currency, status, bank_account_id, metadata, created_at)
       VALUES ($1,'withdraw_to_bank',$2,'ZMW','pending',$3,$4::jsonb, now()) RETURNING *`,
      [req.userId, amount, dest_bank_account_id, JSON.stringify({ source, initiated_at: new Date().toISOString() })]
    );
    const bankTx = txRows[0];

    const provider = getProviderForBank(destAccount.bank_code);

    if (source === 'wallet') {
      // debit user wallet atomically
      const walletService = require('../services/walletService');
      // try to deduct via transfer from wallet to "external" (we'll implement a top-level debit)
      // We'll implement wallet debit by performing transfer with negative topup logic:
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');
        // lock wallet
        const { rows: wRows } = await client.query(`SELECT * FROM wallets WHERE user_id=$1 FOR UPDATE`, [req.userId]);
        if (!wRows.length) throw new Error('wallet_not_found');
        const wallet = wRows[0];
        if (parseFloat(wallet.balance) < parseFloat(amount)) throw new Error('insufficient_funds');

        const newBalance = (parseFloat(wallet.balance) - parseFloat(amount)).toFixed(2);
        await client.query(`UPDATE wallets SET balance=$1 WHERE id=$2`, [newBalance, wallet.id]);

        await client.query(
          `INSERT INTO transactions (wallet_id, type, amount, currency, metadata, created_at)
           VALUES ($1, 'withdraw_to_bank', $2, $3, $4::jsonb, now())`,
          [wallet.id, amount, wallet.currency, JSON.stringify({ bankTxId: bankTx.id, destBankAccountId: dest_bank_account_id })]
        );

        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }

      // now call provider.credit to send to destination bank
      const result = await provider.credit({ bankAccount: destAccount, amount, reference: bankTx.id });
      if (result && result.success) {
        await db.query(`UPDATE bank_transactions SET status='success', metadata = $1::jsonb WHERE id=$2`, [JSON.stringify({ ...bankTx.metadata, externalId: result.externalId }), bankTx.id]);
        return res.json({ success: true, bankTxId: bankTx.id });
      } else {
        // Try to refund wallet — in production you'd have complex compensation logic
        // For mock, refund immediately
        const walletService = require('../services/walletService');
        await walletService.topUp({ userId: req.userId, amount, metadata: { refund_for: bankTx.id } });
        await db.query(`UPDATE bank_transactions SET status='failed', metadata = $1::jsonb WHERE id=$2`, [JSON.stringify({ ...bankTx.metadata, result }), bankTx.id]);
        return res.status(400).json({ error: 'bank_credit_failed' });
      }

    } else if (source === 'another_bank') {
      // bank → bank transfer (mock: debit source bank, credit dest bank)
      if (!source_bank_account_id) return res.status(400).json({ error: 'source_bank_required' });
      const { rows: sRows } = await db.query('SELECT * FROM bank_accounts WHERE id=$1', [source_bank_account_id]);
      if (!sRows.length) return res.status(404).json({ error: 'source_not_found' });
      const sourceAccount = sRows[0];

      const sourceProvider = getProviderForBank(sourceAccount.bank_code);
      // debit source
      const debitResult = await sourceProvider.debit({ bankAccount: sourceAccount, amount, reference: bankTx.id });
      if (!debitResult || !debitResult.success) {
        await db.query(`UPDATE bank_transactions SET status='failed', metadata = $1::jsonb WHERE id=$2`, [JSON.stringify({ ...bankTx.metadata, debitResult }), bankTx.id]);
        return res.status(400).json({ error: 'source_bank_debit_failed' });
      }
      // credit dest
      const creditResult = await provider.credit({ bankAccount: destAccount, amount, reference: bankTx.id });
      if (!creditResult || !creditResult.success) {
        // optionally refund sourceAccount via provider.credit(sourceAccount) — skip for mock
        await db.query(`UPDATE bank_transactions SET status='failed', metadata = $1::jsonb WHERE id=$2`, [JSON.stringify({ ...bankTx.metadata, debitResult, creditResult }), bankTx.id]);
        return res.status(400).json({ error: 'dest_bank_credit_failed' });
      }

      await db.query(`UPDATE bank_transactions SET status='success', metadata = $1::jsonb WHERE id=$2`, [JSON.stringify({ ...bankTx.metadata, debitExternalId: debitResult.externalId, creditExternalId: creditResult.externalId }), bankTx.id]);
      return res.json({ success: true, bankTxId: bankTx.id });
    } else {
      return res.status(400).json({ error: 'invalid_source' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'server_error' });
  }
});

/**
 * TRANSFER FUNDS TO BANK (from wallet to a bank that may be unlinked)
 * This is similar to withdraw_to_bank but with more UX options. We'll expose /transfer-to-bank
 */
router.post('/transfer-to-bank', auth, async (req, res) => {
  // For brevity, route to /withdraw same logic
  return router.handle(req, res);
});

module.exports = router;
