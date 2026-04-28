import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import './Skills.css';

const fallbackSkills = [
  { id: 1, name: 'React.js', level: 90, category: 'Frontend' },
  { id: 2, name: 'JavaScript', level: 85, category: 'Frontend' },
  { id: 3, name: 'HTML/CSS', level: 95, category: 'Frontend' },
  { id: 4, name: 'Node.js', level: 75, category: 'Backend' },
  { id: 5, name: 'Python', level: 70, category: 'Backend' },
  { id: 6, name: 'UI/UX Design', level: 80, category: 'Design' },
];

const toolsData = [
  { name: 'VS Code', icon: '⚡' },
  { name: 'Git & GitHub', icon: '🔀' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Terminal', icon: '💻' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Vercel', icon: '▲' },
];

const Skills = () => {
  const [skillsData, setSkillsData] = useState(fallbackSkills);

  useEffect(() => {
    api.getSkills()
      .then((data) => {
        if (data.length > 0) setSkillsData(data);
      })
      .catch(() => {/* Use fallback data */});
  }, []);

  return (
    <section id="about" className="section skills-section">
      <div className="container">
        <div className="skills-header">
          <p className="section-label">
            <span className="accent-dot"></span> About & Skills
          </p>
          <h2 className="heading-lg">
            Architecting<br />
            <span className="text-accent">Digital</span><br />
            Precision.
          </h2>
        </div>

        <div className="skills-grid">
          <div className="skills-col">
            <h3 className="heading-md">Skills & Expertise</h3>
            <div className="skills-bars">
              {skillsData.map((skill) => (
                <div className="skill-item" key={skill.id || skill.name}>
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-col">
            <h3 className="heading-md">Tools & Stack</h3>
            <div className="tools-grid">
              {toolsData.map((tool) => (
                <div className="tool-card glass-card" key={tool.name}>
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
