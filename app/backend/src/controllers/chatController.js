const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// search (users or organizations) by query
router.get('/search', auth, async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ results: [] });

  // search users by name or phone
  const users = await db.query(`SELECT id, name, phone FROM users WHERE (name ILIKE $1 OR phone ILIKE $1) AND id <> $2 LIMIT 20`, [`%${q}%`, req.userId]);
  // organizations/companies: placeholder - in production query company table
  const companies = [
    { id: 'org-1', name: 'Kalmpay Support', type: 'organization', identifier: 'support@kalmpay' },
    { id: 'org-2', name: 'Acme Corp', type: 'company', identifier: 'acme' }
  ].filter(c => c.name.toLowerCase().includes(q.toLowerCase()));

  const results = [
    ...users.rows.map(u => ({ type: 'user', id: u.id, name: u.name || u.phone, identifier: u.id })),
    ...companies.map(c => ({ type: c.type, id: c.id, name: c.name, identifier: c.identifier }))
  ];

  return res.json({ results });
});

// send message
router.post('/message', auth, async (req, res) => {
  const { recipient_type, recipient_identifier, body } = req.body;
  if (!recipient_type || !recipient_identifier || !body) return res.status(400).json({ error: 'missing_fields' });

  const { rows } = await db.query(
    `INSERT INTO messages (sender_id, recipient_type, recipient_identifier, body, metadata, created_at) VALUES ($1,$2,$3,$4,$5::jsonb, now()) RETURNING *`,
    [req.userId, recipient_type, recipient_identifier, body, JSON.stringify({})]
  );
  return res.json({ message: rows[0] });
});

// list messages (basic)
router.get('/messages', auth, async (req, res) => {
  const q = await db.query(`SELECT * FROM messages WHERE (sender_id=$1 OR recipient_identifier=$2) ORDER BY created_at DESC LIMIT 100`, [req.userId, req.userId]);
  return res.json({ messages: q.rows });
});

module.exports = router;
