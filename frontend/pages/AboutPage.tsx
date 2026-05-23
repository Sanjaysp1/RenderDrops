import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, TrendingUp } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const AboutPage: React.FC = () => {
  const values = [
    { icon: Target, title: 'Precision', desc: 'Every project is executed with meticulous attention to detail and quality.', id: 'val-01' },
    { icon: Users, title: 'Collaboration', desc: 'Our teams work together seamlessly to deliver exceptional results.', id: 'val-02' },
    { icon: Lightbulb, title: 'Innovation', desc: 'We push creative boundaries to deliver unique visual experiences.', id: 'val-03' },
    { icon: TrendingUp, title: 'Impact', desc: 'We focus on creating content that drives visibility and engagement.', id: 'val-04' },
  ];

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      data-testid="about-page" 
      className="min-h-screen pt-32 pb-20 relative bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-20 border-b border-white/10 pb-10">
          <p className="text-sm text-[#FF0033] font-bold mb-4 tracking-widest uppercase">About Us</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
            Core <span className="text-[#FF0033]">Identity</span>
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <div className="bg-black/60 border border-white/10 p-10 rounded-3xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white tracking-wide uppercase mb-6">
                Mission Statement
              </h2>
              <p className="text-base text-neutral-300 leading-relaxed mb-6 font-medium">
                RenderDrops is a multi-disciplinary creative and media collective built on design, storytelling,
                and execution. We specialize in transforming ideas into high-impact visual experiences through
                content, branding, and on-ground engagement.
              </p>
              <p className="text-base text-neutral-300 leading-relaxed font-medium">
                Our strength lies in combining creativity with strategy, delivering not just visuals, but
                visibility. Whether it's videography, graphic design, advanced visual effects, or brand outreach,
                RenderDrops operates through a structured creative ecosystem designed to bring your vision to life.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-7">
            <h2 className="text-xl font-bold text-white tracking-wide uppercase mb-8 flex items-center">
              <span className="w-2 h-2 bg-[#FF0033] rounded-full mr-3" />
              Creative Ecosystem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Media Team', desc: 'Videography, photography, and professional editing to produce high-quality visual content.' },
                { title: 'Design Team', desc: 'Graphic design, branding, and creative communication for impactful visual storytelling.' },
                { title: 'VFX Team', desc: 'Advanced visual effects and creative enhancements for cinematic output.' },
                { title: 'PR Team', desc: 'Brand outreach, collaborations, and audience engagement strategies.' }
              ].map((team, idx) => (
                <div key={idx} className="border border-white/10 bg-black/60 backdrop-blur-md p-8 rounded-3xl hover:border-[#FF0033]/50 transition-colors group">
                  <h3 className="text-lg font-bold text-[#FF0033] mb-3 group-hover:text-white transition-colors">
                    {team.title}
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                    {team.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white tracking-wide uppercase mb-12 text-center">
            Core Drivers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.id} className="border border-white/10 bg-black/60 backdrop-blur-md p-8 rounded-3xl text-center group hover:bg-[#FF0033]/10 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#FF0033] transition-colors">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide mb-4">{value.title}</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed font-medium">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
