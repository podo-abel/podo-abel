import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ═══════════════════════════════════
//  EXPERIENCE
// ═══════════════════════════════════

// GET /api/resume/experience (public)
router.get('/experience', (req, res) => {
  const data = db
    .prepare('SELECT * FROM experience ORDER BY display_order ASC')
    .all()
    .map((e) => ({ ...e, tags: JSON.parse(e.tags || '[]') }));
  res.json(data);
});

// POST /api/resume/experience (admin)
router.post('/experience', requireAuth, (req, res) => {
  const { role, company, period, description, tags, display_order } = req.body;
  if (!role) return res.status(400).json({ error: 'Role is required' });

  const result = db.prepare(`
    INSERT INTO experience (role, company, period, description, tags, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(role, company || '', period || '', description || '', JSON.stringify(tags || []), display_order || 0);

  res.status(201).json({ id: result.lastInsertRowid, message: 'Experience created' });
});

// PUT /api/resume/experience/:id (admin)
router.put('/experience/:id', requireAuth, (req, res) => {
  const { role, company, period, description, tags, display_order } = req.body;
  const existing = db.prepare('SELECT * FROM experience WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  db.prepare(`
    UPDATE experience SET role = ?, company = ?, period = ?, description = ?, tags = ?, display_order = ?
    WHERE id = ?
  `).run(
    role || existing.role,
    company ?? existing.company,
    period ?? existing.period,
    description ?? existing.description,
    JSON.stringify(tags || JSON.parse(existing.tags || '[]')),
    display_order ?? existing.display_order,
    req.params.id
  );

  res.json({ message: 'Experience updated' });
});

// DELETE /api/resume/experience/:id (admin)
router.delete('/experience/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
  res.json({ message: 'Experience deleted' });
});

// ═══════════════════════════════════
//  EDUCATION
// ═══════════════════════════════════

// GET /api/resume/education (public)
router.get('/education', (req, res) => {
  const data = db
    .prepare('SELECT * FROM education ORDER BY display_order ASC')
    .all();
  res.json(data);
});

// POST /api/resume/education (admin)
router.post('/education', requireAuth, (req, res) => {
  const { degree, institution, period, description, display_order } = req.body;
  if (!degree) return res.status(400).json({ error: 'Degree is required' });

  const result = db.prepare(`
    INSERT INTO education (degree, institution, period, description, display_order)
    VALUES (?, ?, ?, ?, ?)
  `).run(degree, institution || '', period || '', description || '', display_order || 0);

  res.status(201).json({ id: result.lastInsertRowid, message: 'Education created' });
});

// PUT /api/resume/education/:id (admin)
router.put('/education/:id', requireAuth, (req, res) => {
  const { degree, institution, period, description, display_order } = req.body;
  const existing = db.prepare('SELECT * FROM education WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  db.prepare(`
    UPDATE education SET degree = ?, institution = ?, period = ?, description = ?, display_order = ?
    WHERE id = ?
  `).run(
    degree || existing.degree,
    institution ?? existing.institution,
    period ?? existing.period,
    description ?? existing.description,
    display_order ?? existing.display_order,
    req.params.id
  );

  res.json({ message: 'Education updated' });
});

// DELETE /api/resume/education/:id (admin)
router.delete('/education/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM education WHERE id = ?').run(req.params.id);
  res.json({ message: 'Education deleted' });
});

export default router;
