import bcrypt from 'bcryptjs';
import db from './db.js';

/**
 * Seeds the database with initial data.
 * Run with: node server/seed.js
 */

// ─── Admin User ───
const adminExists = db.prepare('SELECT id FROM admin LIMIT 1').get();
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run(
    'abel',
    hashedPassword
  );
  console.log('✅ Admin user created (username: abel, password: admin123)');
  console.log('   ⚠️  Change this password after first login!');
} else {
  console.log('ℹ️  Admin user already exists, skipping.');
}

// ─── Projects ───
const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
if (projectCount === 0) {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A modern online shopping experience with cart, checkout and payment integration.',
      tags: JSON.stringify(['React', 'Node.js', 'Stripe']),
      color: '#1a3a2a',
      github_url: 'https://github.com/podo-abel',
      live_url: '#',
      display_order: 1,
    },
    {
      title: 'Dashboard Analytics',
      description: 'Real-time data visualization dashboard with interactive charts and dark mode.',
      tags: JSON.stringify(['React', 'D3.js', 'Firebase']),
      color: '#1a2a3a',
      github_url: 'https://github.com/podo-abel',
      live_url: '#',
      display_order: 2,
    },
    {
      title: 'Social Media App',
      description: 'Full-stack social platform with real-time messaging and media sharing.',
      tags: JSON.stringify(['Next.js', 'MongoDB', 'Socket.io']),
      color: '#2a1a3a',
      github_url: 'https://github.com/podo-abel',
      live_url: '#',
      display_order: 3,
    },
    {
      title: 'AI Chat Interface',
      description: 'Conversational AI interface powered by modern language models.',
      tags: JSON.stringify(['Python', 'React', 'OpenAI']),
      color: '#3a2a1a',
      github_url: 'https://github.com/podo-abel',
      live_url: '#',
      display_order: 4,
    },
  ];

  const insertProject = db.prepare(`
    INSERT INTO projects (title, description, tags, color, github_url, live_url, display_order)
    VALUES (@title, @description, @tags, @color, @github_url, @live_url, @display_order)
  `);

  for (const project of projects) {
    insertProject.run(project);
  }
  console.log(`✅ ${projects.length} projects seeded.`);
} else {
  console.log('ℹ️  Projects already exist, skipping.');
}

// ─── Certificates ───
const certCount = db.prepare('SELECT COUNT(*) as count FROM certificates').get().count;
if (certCount === 0) {
  const certs = [
    { title: 'Responsive Web Design', issuer: 'freeCodeCamp', date: '2024', icon: '🌐', color: '#0a3d2a', display_order: 1 },
    { title: 'JavaScript Algorithms & Data Structures', issuer: 'freeCodeCamp', date: '2024', icon: '⚡', color: '#2a1a3d', display_order: 2 },
    { title: 'Front End Development Libraries', issuer: 'freeCodeCamp', date: '2025', icon: '📚', color: '#1a2a3d', display_order: 3 },
    { title: 'React — The Complete Guide', issuer: 'Udemy', date: '2025', icon: '⚛️', color: '#3d2a0a', display_order: 4 },
    { title: 'Git & GitHub Mastery', issuer: 'Coursera', date: '2025', icon: '🔀', color: '#1a3d1a', display_order: 5 },
    { title: 'UI/UX Design Fundamentals', issuer: 'Google', date: '2025', icon: '🎨', color: '#3d1a2a', display_order: 6 },
  ];

  const insertCert = db.prepare(`
    INSERT INTO certificates (title, issuer, date, icon, color, display_order)
    VALUES (@title, @issuer, @date, @icon, @color, @display_order)
  `);

  for (const cert of certs) {
    insertCert.run(cert);
  }
  console.log(`✅ ${certs.length} certificates seeded.`);
} else {
  console.log('ℹ️  Certificates already exist, skipping.');
}

// ─── Experience ───
const expCount = db.prepare('SELECT COUNT(*) as count FROM experience').get().count;
if (expCount === 0) {
  const experiences = [
    {
      role: 'Frontend Developer',
      company: 'Self-Employed / Freelance',
      period: '2025 — Present',
      description: 'Building modern web applications with React, Next.js, and clean UI/UX principles. Working on real-world client projects and personal products.',
      tags: JSON.stringify(['React', 'JavaScript', 'CSS']),
      display_order: 1,
    },
    {
      role: 'Web Development Student',
      company: 'Self-Taught & Online Courses',
      period: '2024 — 2025',
      description: 'Intensive self-study covering HTML, CSS, JavaScript, React, Node.js, and design fundamentals through platforms like freeCodeCamp, Udemy, and YouTube.',
      tags: JSON.stringify(['HTML/CSS', 'JavaScript', 'Git']),
      display_order: 2,
    },
    {
      role: 'Open Source Contributor',
      company: 'GitHub Community',
      period: '2024 — Present',
      description: 'Contributing to open source projects, fixing bugs, and collaborating with developers worldwide to improve codebases.',
      tags: JSON.stringify(['Open Source', 'Git', 'Collaboration']),
      display_order: 3,
    },
  ];

  const insertExp = db.prepare(`
    INSERT INTO experience (role, company, period, description, tags, display_order)
    VALUES (@role, @company, @period, @description, @tags, @display_order)
  `);

  for (const exp of experiences) {
    insertExp.run(exp);
  }
  console.log(`✅ ${experiences.length} experience entries seeded.`);
} else {
  console.log('ℹ️  Experience already exists, skipping.');
}

// ─── Education ───
const eduCount = db.prepare('SELECT COUNT(*) as count FROM education').get().count;
if (eduCount === 0) {
  const education = [
    {
      degree: 'Software Engineering',
      institution: 'University / College',
      period: '2023 — Present',
      description: 'Studying computer science fundamentals, algorithms, data structures, and software engineering best practices.',
      display_order: 1,
    },
    {
      degree: 'Online Certifications',
      institution: 'Various Platforms',
      period: '2024 — Present',
      description: 'Completed multiple certifications in web development, React, JavaScript, and responsive design.',
      display_order: 2,
    },
  ];

  const insertEdu = db.prepare(`
    INSERT INTO education (degree, institution, period, description, display_order)
    VALUES (@degree, @institution, @period, @description, @display_order)
  `);

  for (const edu of education) {
    insertEdu.run(edu);
  }
  console.log(`✅ ${education.length} education entries seeded.`);
} else {
  console.log('ℹ️  Education already exists, skipping.');
}

// ─── Skills ───
const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;
if (skillCount === 0) {
  const skills = [
    { name: 'React.js', level: 90, category: 'Frontend', icon: '⚛️', display_order: 1 },
    { name: 'JavaScript', level: 85, category: 'Frontend', icon: '⚡', display_order: 2 },
    { name: 'HTML/CSS', level: 95, category: 'Frontend', icon: '🌐', display_order: 3 },
    { name: 'Node.js', level: 75, category: 'Backend', icon: '🟢', display_order: 4 },
    { name: 'Python', level: 70, category: 'Backend', icon: '🐍', display_order: 5 },
    { name: 'UI/UX Design', level: 80, category: 'Design', icon: '🎨', display_order: 6 },
  ];

  const insertSkill = db.prepare(`
    INSERT INTO skills (name, level, category, icon, display_order)
    VALUES (@name, @level, @category, @icon, @display_order)
  `);

  for (const skill of skills) {
    insertSkill.run(skill);
  }
  console.log(`✅ ${skills.length} skills seeded.`);
} else {
  console.log('ℹ️  Skills already exist, skipping.');
}

console.log('\n🎉 Database seeding complete!');
