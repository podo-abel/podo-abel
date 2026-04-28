import { jsPDF } from 'jspdf';
import { api } from './api';

/**
 * Generates and downloads a professional PDF CV for Abel Dingetu.
 * Pulls data dynamically from the API, with hardcoded fallbacks.
 */
export default async function generateCV() {
  // Fetch data from API with fallbacks
  let skills, experience, education;

  try {
    [skills, experience, education] = await Promise.all([
      api.getSkills().catch(() => null),
      api.getExperience().catch(() => null),
      api.getEducation().catch(() => null),
    ]);
  } catch {
    // Use all fallbacks
  }

  // Fallback data
  if (!skills || skills.length === 0) {
    skills = [
      { name: 'React.js', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'HTML / CSS', level: 95 },
      { name: 'Node.js', level: 75 },
      { name: 'Python', level: 70 },
      { name: 'UI/UX Design', level: 80 },
    ];
  }

  if (!experience || experience.length === 0) {
    experience = [
      {
        role: 'Frontend Developer',
        company: 'Self-Employed / Freelance',
        period: '2025 — Present',
        description: 'Building modern web applications with React, Next.js, and clean UI/UX principles. Working on real-world client projects and personal products.',
        tags: ['React', 'JavaScript', 'CSS'],
      },
      {
        role: 'Web Development Student',
        company: 'Self-Taught & Online Courses',
        period: '2024 — 2025',
        description: 'Intensive self-study covering HTML, CSS, JavaScript, React, Node.js, and design fundamentals through platforms like freeCodeCamp, Udemy, and YouTube.',
        tags: ['HTML/CSS', 'JavaScript', 'Git'],
      },
      {
        role: 'Open Source Contributor',
        company: 'GitHub Community',
        period: '2024 — Present',
        description: 'Contributing to open source projects, fixing bugs, and collaborating with developers worldwide to improve codebases.',
        tags: ['Open Source', 'Git', 'Collaboration'],
      },
    ];
  }

  if (!education || education.length === 0) {
    education = [
      {
        degree: 'Software Engineering',
        institution: 'University / College',
        period: '2023 — Present',
        description: 'Studying computer science fundamentals, algorithms, data structures, and software engineering best practices.',
      },
      {
        degree: 'Online Certifications',
        institution: 'Various Platforms',
        period: '2024 — Present',
        description: 'Completed multiple certifications in web development, React, JavaScript, and responsive design.',
      },
    ];
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ─── Colors ───
  const dark = [13, 13, 13];
  const accent = [204, 255, 0];
  const white = [240, 240, 240];
  const muted = [140, 140, 140];
  const cardBg = [21, 21, 21];

  // ─── Background ───
  doc.setFillColor(...dark);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // ─── Accent sidebar stripe ───
  doc.setFillColor(...accent);
  doc.rect(0, 0, 4, pageHeight, 'F');

  // ─── Header ───
  let y = margin;

  doc.setTextColor(...white);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ABEL DINGETU', margin + 6, y + 8);

  doc.setFontSize(11);
  doc.setTextColor(...accent);
  doc.setFont('helvetica', 'normal');
  doc.text('Software Engineer in Progress', margin + 6, y + 16);

  // ─── Contact info bar ───
  y += 26;
  doc.setFillColor(...cardBg);
  doc.roundedRect(margin + 6, y, contentWidth - 6, 10, 2, 2, 'F');

  doc.setFontSize(8.5);
  doc.setTextColor(...muted);
  doc.setFont('helvetica', 'normal');
  const contactItems = [
    '📧 fugdu73@gmail.com',
    '📍 Available Worldwide',
    '💼 Open for Opportunities',
  ];
  const contactX = margin + 10;
  const spacing = (contentWidth - 10) / contactItems.length;
  contactItems.forEach((item, i) => {
    doc.text(item, contactX + i * spacing, y + 6.5);
  });

  // ─── Summary ───
  y += 18;
  drawSectionTitle(doc, 'ABOUT ME', margin + 6, y, accent, white);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.setFont('helvetica', 'normal');
  const summary =
    'Aspiring software engineer with a passion for building modern web applications. ' +
    'Skilled in React, JavaScript, HTML/CSS, Node.js, and UI/UX design. ' +
    'Dedicated to continuous learning and contributing to the developer community through open source.';
  const summaryLines = doc.splitTextToSize(summary, contentWidth - 10);
  doc.text(summaryLines, margin + 10, y);
  y += summaryLines.length * 4.5 + 4;

  // ─── Skills ───
  drawSectionTitle(doc, 'SKILLS & EXPERTISE', margin + 6, y, accent, white);
  y += 8;

  // Draw skills in two columns
  const colWidth = (contentWidth - 16) / 2;
  skills.forEach((skill, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const sx = margin + 10 + col * (colWidth + 6);
    const sy = y + row * 11;

    doc.setFontSize(8.5);
    doc.setTextColor(...white);
    doc.text(skill.name, sx, sy);
    doc.setTextColor(...muted);
    doc.text(`${skill.level}%`, sx + colWidth - 8, sy);

    // Bar background
    doc.setFillColor(40, 40, 40);
    doc.roundedRect(sx, sy + 2, colWidth - 2, 3, 1, 1, 'F');
    // Bar fill
    doc.setFillColor(...accent);
    const fillWidth = ((colWidth - 2) * skill.level) / 100;
    doc.roundedRect(sx, sy + 2, fillWidth, 3, 1, 1, 'F');
  });

  y += Math.ceil(skills.length / 2) * 11 + 6;

  // ─── Experience ───
  drawSectionTitle(doc, 'EXPERIENCE', margin + 6, y, accent, white);
  y += 8;

  experience.forEach((exp) => {
    // Ensure tags exist
    const tags = exp.tags || [];

    // Card background
    doc.setFillColor(...cardBg);
    doc.roundedRect(margin + 10, y - 3, contentWidth - 14, 30, 2, 2, 'F');

    doc.setFontSize(10);
    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.text(exp.role, margin + 14, y + 2);

    doc.setFontSize(8);
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'normal');
    doc.text(exp.company, margin + 14, y + 7);

    doc.setTextColor(...muted);
    doc.text(exp.period, contentWidth + margin - 8, y + 2, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(...muted);
    const descLines = doc.splitTextToSize(exp.description || '', contentWidth - 24);
    doc.text(descLines, margin + 14, y + 13);

    // Tags
    let tagX = margin + 14;
    doc.setFontSize(7);
    tags.forEach((tag) => {
      const tw = doc.getStringUnitWidth(tag) * 7 * 0.35 + 5;
      doc.setFillColor(30, 30, 30);
      doc.roundedRect(tagX, y + 20, tw, 5, 1, 1, 'F');
      doc.setTextColor(...accent);
      doc.text(tag, tagX + 2.5, y + 23.5);
      tagX += tw + 2;
    });

    y += 34;
  });

  // ─── Education ───
  y += 2;
  drawSectionTitle(doc, 'EDUCATION', margin + 6, y, accent, white);
  y += 8;

  education.forEach((edu) => {
    doc.setFillColor(...cardBg);
    doc.roundedRect(margin + 10, y - 3, contentWidth - 14, 22, 2, 2, 'F');

    doc.setFontSize(10);
    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.text(edu.degree, margin + 14, y + 2);

    doc.setFontSize(8);
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'normal');
    doc.text(edu.institution, margin + 14, y + 7);

    doc.setTextColor(...muted);
    doc.text(edu.period, contentWidth + margin - 8, y + 2, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(...muted);
    const descLines = doc.splitTextToSize(edu.description || '', contentWidth - 24);
    doc.text(descLines, margin + 14, y + 13);

    y += 26;
  });

  // ─── Tools ───
  y += 2;
  drawSectionTitle(doc, 'TOOLS & STACK', margin + 6, y, accent, white);
  y += 8;

  const tools = ['VS Code', 'Git & GitHub', 'Figma', 'Terminal', 'Docker', 'Vercel'];
  let toolX = margin + 10;
  doc.setFontSize(8);
  tools.forEach((tool) => {
    const tw = doc.getStringUnitWidth(tool) * 8 * 0.35 + 7;
    doc.setFillColor(...cardBg);
    doc.roundedRect(toolX, y, tw, 7, 2, 2, 'F');
    doc.setTextColor(...white);
    doc.text(tool, toolX + 3.5, y + 4.8);
    toolX += tw + 3;
    if (toolX > pageWidth - margin - 10) {
      toolX = margin + 10;
      y += 10;
    }
  });

  // ─── Footer ───
  y = pageHeight - 12;
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.3);
  doc.line(margin + 6, y, pageWidth - margin, y);
  y += 5;
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text('© 2026 Abel Dingetu — Built with believe & passion.', pageWidth / 2, y, {
    align: 'center',
  });

  // ─── Save ───
  doc.save('Abel_Dingetu_CV.pdf');
}

/**
 * Draws a styled section title with accent bar.
 */
function drawSectionTitle(doc, title, x, y, accent, white) {
  doc.setFillColor(...accent);
  doc.rect(x, y - 3, 16, 1.5, 'F');

  doc.setFontSize(11);
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x, y + 4);
}
