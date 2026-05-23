import React from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Lucide.Facebook, href: 'https://facebook.com', label: 'Facebook', testId: 'social-facebook' },
    { icon: Lucide.Twitter, href: 'https://twitter.com', label: 'Twitter', testId: 'social-twitter' },
    { icon: Lucide.Instagram, href: 'https://instagram.com', label: 'Instagram', testId: 'social-instagram' },
    { icon: Lucide.Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', testId: 'social-linkedin' },
    { icon: Lucide.Youtube, href: 'https://youtube.com', label: 'YouTube', testId: 'social-youtube' },
  ];

  return (
    <footer data-testid="main-footer" className="bg-[#020202] border-t border-white/10 pt-20 pb-12 relative z-40 overflow-hidden text-left shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 text-left">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center space-x-0 mb-6">
              <span className="text-3xl font-black uppercase tracking-tighter text-[#FF0033]">RENDER</span>
              <span className="text-3xl font-black uppercase tracking-tighter text-white">DROPS</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-md font-medium text-left">
              A multi-disciplinary creative and media collective. Design, storytelling, and flawless execution.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col items-start">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-6 border-b border-white/10 pb-2 w-full text-left">
              Directory
            </h3>
            <ul className="space-y-4 w-full">
              {['Home', 'About', 'Teams', 'Contact'].map((item) => (
                <li key={item} className="text-left">
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-sm font-medium text-neutral-500 hover:text-[#FF0033] transition-colors inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="md:col-span-4 flex flex-col items-start">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-6 border-b border-white/10 pb-2 w-full text-left">
              Social Network
            </h3>
            <div className="flex flex-wrap gap-3 justify-start w-full">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, backgroundColor: '#FF0033', color: '#ffffff', borderColor: '#FF0033' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 transition-colors duration-300"
                  >
                    {Icon && <Icon size={18} />}
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <p className="text-xs text-neutral-600 font-medium">
            © {new Date().getFullYear()} RenderDrops. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-xs text-neutral-600 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
