import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import './Certificates.css';

const fallbackCerts = [
  { id: 1, title: 'Responsive Web Design', issuer: 'freeCodeCamp', date: '2024', icon: '🌐', color: '#0a3d2a' },
  { id: 2, title: 'JavaScript Algorithms & Data Structures', issuer: 'freeCodeCamp', date: '2024', icon: '⚡', color: '#2a1a3d' },
  { id: 3, title: 'Front End Development Libraries', issuer: 'freeCodeCamp', date: '2025', icon: '📚', color: '#1a2a3d' },
  { id: 4, title: 'React — The Complete Guide', issuer: 'Udemy', date: '2025', icon: '⚛️', color: '#3d2a0a' },
  { id: 5, title: 'Git & GitHub Mastery', issuer: 'Coursera', date: '2025', icon: '🔀', color: '#1a3d1a' },
  { id: 6, title: 'UI/UX Design Fundamentals', issuer: 'Google', date: '2025', icon: '🎨', color: '#3d1a2a' },
];

const Certificates = () => {
  const [certificatesData, setCertificatesData] = useState(fallbackCerts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    api.getCertificates()
      .then((data) => {
        if (data.length > 0) setCertificatesData(data);
      })
      .catch(() => {});
  }, []);

  const visibleCount = 3;
  const maxIndex = Math.max(0, certificatesData.length - visibleCount);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const goTo = (index) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goNext = () => goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  const goPrev = () => goTo(currentIndex <= 0 ? maxIndex : currentIndex - 1);

  return (
    <section id="certificates" className="section certificates-section">
      <div className="container">
        <div className="certificates-header">
          <p className="section-label">
            <span className="accent-dot"></span> Certificates
          </p>
          <h2 className="heading-lg">
            EARNED &<br />
            <span className="text-accent">VERIFIED.</span>
          </h2>
          <p className="certificates-subtitle">
            Certifications that validate my skills and commitment to continuous learning.
          </p>
        </div>

        {/* Shelf Display */}
        <div className="shelf-wrapper">
          <div className="shelf-scene">
            <div
              className="shelf-track"
              ref={carouselRef}
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {certificatesData.map((cert, index) => {
                const isVisible =
                  index >= currentIndex && index < currentIndex + visibleCount;
                return (
                  <div
                    className={`cert-card-wrapper ${isVisible ? 'visible' : 'hidden'}`}
                    key={cert.id}
                    style={{ '--card-index': index - currentIndex }}
                  >
                    <div className="cert-card" style={{ '--cert-bg': cert.color }}>
                      <div className="cert-glow"></div>
                      <div className="cert-badge">
                        <span className="cert-icon">{cert.icon}</span>
                      </div>
                      <div className="cert-ornament-top"></div>
                      <div className="cert-ornament-bottom"></div>
                      <div className="cert-body">
                        <p className="cert-label">Certificate of Completion</p>
                        <h3 className="cert-title">{cert.title}</h3>
                        <div className="cert-divider"></div>
                        <div className="cert-meta">
                          <span className="cert-issuer">{cert.issuer}</span>
                          <span className="cert-date">{cert.date}</span>
                        </div>
                      </div>
                      <div className="cert-seal">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="7"></circle>
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shelf surface */}
            <div className="shelf-surface">
              <div className="shelf-top"></div>
              <div className="shelf-front"></div>
              <div className="shelf-shadow"></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="shelf-nav">
            <button className="shelf-btn" onClick={goPrev} aria-label="Previous certificate">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="shelf-dots">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`shelf-dot ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                ></button>
              ))}
            </div>
            <button className="shelf-btn" onClick={goNext} aria-label="Next certificate">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
