import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/projects — Get all projects (public)
router.get('/', (req, res) => {
  const projects = db
    .prepare('SELECT * FROM projects ORDER BY display_order ASC')
    .all()
    .map((p) => ({ ...p, tags: JSON.parse(p.tags || '[]') }));
  res.json(projects);
});

// GET /api/projects/:id — Get single project
router.get('/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  project.tags = JSON.parse(project.tags || '[]');
  res.json(project);
});

// POST /api/projects — Create project (admin)
router.post('/', requireAuth, (req, res) => {
  const { title, description, tags, color, github_url, live_url, display_order } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  const result = db.prepare(`
    INSERT INTO projects (title, description, tags, color, github_url, live_url, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    description || '',
    JSON.stringify(tags || []),
    color || '#1a2a3a',
    github_url || '',
    live_url || '',
    display_order || 0
  );

  res.status(201).json({ id: result.lastInsertRowid, message: 'Project created' });
});

// PUT /api/projects/:id — Update project (admin)
router.put('/:id', requireAuth, (req, res) => {
  const { title, description, tags, color, github_url, live_url, display_order } = req.body;

  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  db.prepare(`
    UPDATE projects
    SET title = ?, description = ?, tags = ?, color = ?, github_url = ?, live_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title || existing.title,
    description ?? existing.description,
    JSON.stringify(tags || JSON.parse(existing.tags || '[]')),
    color || existing.color,
    github_url ?? existing.github_url,
    live_url ?? existing.live_url,
    display_order ?? existing.display_order,
    req.params.id
  );

  res.json({ message: 'Project updated' });
});

// DELETE /api/projects/:id — Delete project (admin)
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ message: 'Project deleted' });
});

export default router;
