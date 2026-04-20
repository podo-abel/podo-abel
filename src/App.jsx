import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Admin from './components/Admin';
import './App.css';

function Portfolio() {
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
