import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <div className="portfolio-app">
      <Header />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Resume />
        <Certificates />
        <Contact />
      </main>
    </div>
  );
}

export default App;
