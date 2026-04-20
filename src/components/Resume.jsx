import React, { useState } from 'react';
import generateCV from '../utils/generateCV';
import './Resume.css';

const experienceData = [
  {
    id: 1,
    role: 'Frontend Developer',
    company: 'Self-Employed / Freelance',
    period: '2025 — Present',
    description:
      'Building modern web applications with React, Next.js, and clean UI/UX principles. Working on real-world client projects and personal products.',
    tags: ['React', 'JavaScript', 'CSS'],
  },
  {
    id: 2,
    role: 'Web Development Student',
    company: 'Self-Taught & Online Courses',
    period: '2024 — 2025',
    description:
      'Intensive self-study covering HTML, CSS, JavaScript, React, Node.js, and design fundamentals through platforms like freeCodeCamp, Udemy, and YouTube.',
    tags: ['HTML/CSS', 'JavaScript', 'Git'],
  },
  {
    id: 3,
    role: 'Open Source Contributor',
    company: 'GitHub Community',
    period: '2024 — Present',
    description:
      'Contributing to open source projects, fixing bugs, and collaborating with developers worldwide to improve codebases.',
    tags: ['Open Source', 'Git', 'Collaboration'],
  },
];

const educationData = [
  {
    id: 1,
    degree: 'Software Engineering',
    institution: 'University / College',
    period: '2023 — Present',
    description: 'Studying computer science fundamentals, algorithms, data structures, and software engineering best practices.',
  },
  {
    id: 2,
    degree: 'Online Certifications',
    institution: 'Various Platforms',
    period: '2024 — Present',
    description: 'Completed multiple certifications in web development, React, JavaScript, and responsive design.',
  },
];

const Resume = () => {
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <section id="resume" className="section resume-section">
      <div className="container">
        <div className="resume-header">
          <p className="section-label">
            <span className="accent-dot"></span> Resume
          </p>
          <h2 className="heading-lg">
            MY <span className="text-accent">JOURNEY</span>
            <br />& EXPERIENCE.
          </h2>
          <p className="resume-subtitle">
            A snapshot of my professional growth, education, and the path I've
            taken in software engineering.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="resume-tabs">
          <button
            className={`resume-tab ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Experience
          </button>
          <button
            className={`resume-tab ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5"></path>
            </svg>
            Education
          </button>
        </div>

        {/* Timeline Content */}
        <div className="resume-timeline">
          {activeTab === 'experience' &&
            experienceData.map((item, index) => (
              <div className="timeline-item" key={item.id} style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                  {index < experienceData.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-card glass-card">
                  <div className="timeline-card-header">
                    <div>
                      <h3 className="timeline-role">{item.role}</h3>
                      <p className="timeline-company">{item.company}</p>
                    </div>
                    <span className="timeline-period">{item.period}</span>
                  </div>
                  <p className="timeline-desc">{item.description}</p>
                  {item.tags && (
                    <div className="timeline-tags">
                      {item.tags.map((tag) => (
                        <span className="tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

          {activeTab === 'education' &&
            educationData.map((item, index) => (
              <div className="timeline-item" key={item.id} style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                  {index < educationData.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-card glass-card">
                  <div className="timeline-card-header">
                    <div>
                      <h3 className="timeline-role">{item.degree}</h3>
                      <p className="timeline-company">{item.institution}</p>
                    </div>
                    <span className="timeline-period">{item.period}</span>
                  </div>
                  <p className="timeline-desc">{item.description}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Download CV Button */}
        <div className="resume-download">
          <button onClick={generateCV} className="btn-primary download-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download CV
          </button>
        </div>
      </div>
    </section>
  );
};

export default Resume;
