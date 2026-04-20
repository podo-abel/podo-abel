import { Router } from 'express';
import nodemailer from 'nodemailer';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─── Email transporter (configure in .env) ───
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// POST /api/contact — Submit contact form (public)
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Save to database
  const result = db.prepare(
    'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)'
  ).run(name, email, message);

  // Send email notification if SMTP is configured
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFICATION_EMAIL || 'fugdu73@gmail.com',
        subject: `New Contact: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #0d0d0d; color: #f0f0f0; border-radius: 12px;">
            <h2 style="color: #ccff00; margin-bottom: 20px;">📩 New Portfolio Message</h2>
            <p><strong style="color: #ccff00;">From:</strong> ${name}</p>
            <p><strong style="color: #ccff00;">Email:</strong> ${email}</p>
            <hr style="border-color: #2a2a2a;" />
            <p><strong style="color: #ccff00;">Message:</strong></p>
            <p style="padding: 15px; background: #151515; border-radius: 8px; border-left: 3px solid #ccff00;">${message}</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Email send error:', err.message);
      // Don't fail the request if email fails — message is still saved
    }
  }

  res.status(201).json({
    message: 'Message sent successfully!',
    id: result.lastInsertRowid,
  });
});

// GET /api/contact — Get all messages (admin only)
router.get('/', requireAuth, (req, res) => {
  const messages = db
    .prepare('SELECT * FROM contacts ORDER BY created_at DESC')
    .all();
  res.json(messages);
});

// PUT /api/contact/:id/read — Mark as read (admin only)
router.put('/:id/read', requireAuth, (req, res) => {
  db.prepare('UPDATE contacts SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Marked as read' });
});

// DELETE /api/contact/:id — Delete message (admin only)
router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Message deleted' });
});

export default router;
