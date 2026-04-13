import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <a href="#home" className="logo">
          Abel<span className="accent">.</span>
        </a>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Work</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="btn-secondary nav-btn">
          Let's Talk
        </a>
      </div>
    </header>
  );
};

export default Header;
