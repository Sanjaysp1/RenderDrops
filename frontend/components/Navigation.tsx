import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/teams', label: 'Teams' },
    { path: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-[#020202]/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 border border-[#FF0033] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#FF0033]/20 group-hover:bg-[#FF0033]/40 transition-colors" />
                <Hexagon size={16} className="text-[#FF0033] relative z-10" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-0 leading-none">
                  <span className="text-xl font-black uppercase tracking-tighter text-[#FF0033]">RENDER</span>
                  <span className="text-xl font-black uppercase tracking-tighter text-white">DROPS</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative font-mono text-xs tracking-widest uppercase transition-colors ${
                      isActive ? 'text-[#FF0033]' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {isActive && <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#FF0033] rounded-full animate-pulse" />}
                    {link.label}
                  </Link>
                );
              })}
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="font-mono text-xs tracking-widest uppercase border border-[#FF0033] text-[#FF0033] px-6 py-2 hover:bg-[#FF0033] hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(255,0,51,0.15)]"
                >
                  Connect
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-[#FF0033] hover:text-white transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#020202]/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-8">
              <div className="font-mono text-[10px] text-[#FF0033] border-b border-white/10 pb-2 uppercase tracking-widest">
                Navigation Menu
              </div>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-mono text-xl tracking-widest uppercase transition-colors flex items-center space-x-4 ${
                    location.pathname === link.path ? 'text-[#FF0033]' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="pt-8">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <button className="w-full font-mono text-sm tracking-widest uppercase border border-[#FF0033] bg-[#FF0033]/10 text-[#FF0033] px-6 py-4 hover:bg-[#FF0033] hover:text-white transition-all duration-300">
                    Connect Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
