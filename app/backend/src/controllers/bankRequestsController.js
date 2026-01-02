// GET /banks/linked
router.get('/linked', auth, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM bank_accounts WHERE user_id=$1', [req.userId]);
  return res.json({ bankAccounts: rows });
});

// Request Debt - admin/bank decision later
router.post('/request-debt', auth, async (req, res) => {
  const { amount, purpose } = req.body;
  await db.query(`INSERT INTO bank_transactions (user_id, type, amount, currency, status, metadata, created_at) VALUES ($1,'request_debt',$2,'ZMW','pending',$3::jsonb, now())`, [req.userId, amount, JSON.stringify({ purpose })]);
  return res.json({ success: true });
});

// Request Credit Card
router.post('/request-credit-card', auth, async (req, res) => {
  const { income, idNumber } = req.body;
  // store request into bank_transactions or a new table; here keep it simple
  await db.query(`INSERT INTO bank_transactions (user_id, type, amount, currency, status, metadata, created_at) VALUES ($1,'request_credit_card',0,'ZMW','pending',$2::jsonb, now())`, [req.userId, JSON.stringify({ income, idNumber })]);
  return res.json({ success: true });
});
