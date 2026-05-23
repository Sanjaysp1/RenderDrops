import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TeamsPage from './pages/TeamsPage';
import ContactPage from './pages/ContactPage';
import ParticleEngine from './components/ParticleEngine';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const FooterWrapper = () => {
  const location = useLocation();
  // Strictly hide footer on home page to prevent overlap with the 3D canvas and scroll track
  if (location.pathname === '/') return null;
  return <Footer />;
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent selection:bg-[#FF0033] selection:text-white">
      <HashRouter>
        <ParticleEngine />
        <Navigation />
        <main className="flex-grow relative z-10">
          <AnimatedRoutes />
        </main>
        <FooterWrapper />
      </HashRouter>
    </div>
  );
};

export default App;
