import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import projectRoutes from './routes/projects.js';
import certificateRoutes from './routes/certificates.js';
import resumeRoutes from './routes/resume.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───
app.use(cors());
app.use(express.json());

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/resume', resumeRoutes);

// ─── Serve static frontend in production ───
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`\n🚀 Abel's Portfolio API running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`\n   Routes:`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/projects`);
  console.log(`   GET    /api/certificates`);
  console.log(`   GET    /api/resume/experience`);
  console.log(`   GET    /api/resume/education`);
  console.log(`   POST   /api/contact`);
  console.log(`\n   Admin panel: http://localhost:${PORT}/admin\n`);
});
