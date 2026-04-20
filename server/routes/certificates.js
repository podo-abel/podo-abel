import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/certificates — Get all certificates (public)
router.get('/', (req, res) => {
  const certs = db
    .prepare('SELECT * FROM certificates ORDER BY display_order ASC')
    .all();
  res.json(certs);
});

// POST /api/certificates — Create certificate (admin)
router.post('/', requireAuth, (req, res) => {
  const { title, issuer, date, icon, color, credential_url, display_order } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  const result = db.prepare(`
    INSERT INTO certificates (title, issuer, date, icon, color, credential_url, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, issuer || '', date || '', icon || '📜', color || '#1a2a3a', credential_url || '', display_order || 0);

  res.status(201).json({ id: result.lastInsertRowid, message: 'Certificate created' });
});

// PUT /api/certificates/:id — Update certificate (admin)
router.put('/:id', requireAuth, (req, res) => {
  const { title, issuer, date, icon, color, credential_url, display_order } = req.body;

  const existing = db.prepare('SELECT * FROM certificates WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Certificate not found' });

  db.prepare(`
    UPDATE certificates
    SET title = ?, issuer = ?, date = ?, icon = ?, color = ?, credential_url = ?, display_order = ?
    WHERE id = ?
  `).run(
    title || existing.title,
    issuer ?? existing.issuer,
    date ?? existing.date,
    icon ?? existing.icon,
    color ?? existing.color,
    credential_url ?? existing.credential_url,
    display_order ?? existing.display_order,
    req.params.id
  );

  res.json({ message: 'Certificate updated' });
});

// DELETE /api/certificates/:id — Delete certificate (admin)
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM certificates WHERE id = ?').run(req.params.id);
  res.json({ message: 'Certificate deleted' });
});

export default router;
