import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="section hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <p className="hero-subtitle">
            <span className="accent-dot"></span> Hello
          </p>
          <h1 className="heading-xl">
            I'm a software <br />
            engineer in progress
          </h1>
          <p className="hero-description text-gradient">
            building, learning, and getting better every day.
          </p>
          
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">
              View Work
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="#about" className="btn-link">
              More about me
            </a>
          </div>
        </div>
        
        <div className="hero-terminal">
          <div className="terminal-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="terminal-body">
            <p><span className="keyword">const</span> <span className="entity">developer</span> = <span className="keyword">new</span> Engineer();</p>
            <p><span className="entity">developer</span>.<span className="method">setSkills</span>([</p>
            <p className="indent">"React", "Node.js", "Design"</p>
            <p>]);</p>
            <p><span className="entity">developer</span>.<span className="method">startCoding</span>();</p>
            <p className="comment">// Ready to build the future</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
