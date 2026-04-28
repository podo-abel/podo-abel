import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/skills — Get all skills (public)
router.get('/', (req, res) => {
  const skills = db
    .prepare('SELECT * FROM skills ORDER BY display_order ASC')
    .all();
  res.json(skills);
});

// POST /api/skills — Create skill (admin)
router.post('/', requireAuth, (req, res) => {
  const { name, level, category, icon, display_order } = req.body;

  if (!name) return res.status(400).json({ error: 'Skill name is required' });

  const result = db.prepare(`
    INSERT INTO skills (name, level, category, icon, display_order)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    name,
    level ?? 80,
    category || 'Frontend',
    icon || '⚡',
    display_order || 0
  );

  res.status(201).json({ id: result.lastInsertRowid, message: 'Skill created' });
});

// PUT /api/skills/:id — Update skill (admin)
router.put('/:id', requireAuth, (req, res) => {
  const { name, level, category, icon, display_order } = req.body;

  const existing = db.prepare('SELECT * FROM skills WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Skill not found' });

  db.prepare(`
    UPDATE skills
    SET name = ?, level = ?, category = ?, icon = ?, display_order = ?
    WHERE id = ?
  `).run(
    name || existing.name,
    level ?? existing.level,
    category ?? existing.category,
    icon ?? existing.icon,
    display_order ?? existing.display_order,
    req.params.id
  );

  res.json({ message: 'Skill updated' });
});

// DELETE /api/skills/:id — Delete skill (admin)
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
  res.json({ message: 'Skill deleted' });
});

export default router;
