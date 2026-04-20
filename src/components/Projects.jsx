import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import './Projects.css';

const fallbackProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A modern online shopping experience with cart, checkout and payment integration.',
    tags: ['React', 'Node.js', 'Stripe'],
    color: '#1a3a2a',
    github_url: 'https://github.com/podo-abel',
    live_url: '#',
  },
  {
    id: 2,
    title: 'Dashboard Analytics',
    description: 'Real-time data visualization dashboard with interactive charts and dark mode.',
    tags: ['React', 'D3.js', 'Firebase'],
    color: '#1a2a3a',
    github_url: 'https://github.com/podo-abel',
    live_url: '#',
  },
  {
    id: 3,
    title: 'Social Media App',
    description: 'Full-stack social platform with real-time messaging and media sharing.',
    tags: ['Next.js', 'MongoDB', 'Socket.io'],
    color: '#2a1a3a',
    github_url: 'https://github.com/podo-abel',
    live_url: '#',
  },
  {
    id: 4,
    title: 'AI Chat Interface',
    description: 'Conversational AI interface powered by modern language models.',
    tags: ['Python', 'React', 'OpenAI'],
    color: '#3a2a1a',
    github_url: 'https://github.com/podo-abel',
    live_url: '#',
  },
];

const Projects = () => {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    api.getProjects()
      .then((data) => setProjects(data))
      .catch(() => {/* Use fallback data */});
  }, []);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="projects-header">
          <p className="section-label">
            <span className="accent-dot"></span> Projects
          </p>
          <h2 className="heading-lg">
            STRUCTURAL<br />
            <span className="text-accent">PRECISION.</span>
          </h2>
          <p className="projects-subtitle">
            Each project is a unique piece of development, carefully crafted with attention to detail.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div className="project-card glass-card" key={project.id}>
              <div
                className="project-preview"
                style={{ background: project.color }}
              >
                <div className="project-preview-inner">
                  <div className="code-line"></div>
                  <div className="code-line short"></div>
                  <div className="code-line medium"></div>
                  <div className="code-line"></div>
                  <div className="code-line short"></div>
                </div>
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tags">
                  {(project.tags || []).map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.live_url && project.live_url !== '#' && (
                    <a href={project.live_url} className="project-link" target="_blank" rel="noopener noreferrer">
                      View Project
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </a>
                  )}
                  <a
                    href={project.github_url || 'https://github.com/podo-abel'}
                    className={`project-link ${project.live_url && project.live_url !== '#' ? 'muted' : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source Code
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
