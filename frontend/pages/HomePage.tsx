import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const phaseData = [
  { sub: "//// PORTFOLIO_01", title: "THE BRAND", desc: "The physical embodiment of RenderDrops. Constructed from pure visual data.", link: "/about", linkText: "DISCOVER IDENTITY" },
  { sub: "//// PORTFOLIO_02", title: "THE TEAM", desc: "A network of visionary creators, VFX artists, and strategists working in sync.", link: "/teams", linkText: "EXPLORE TEAMS" },
  { sub: "//// NETWORK_01", title: "X // TWITTER", desc: "Engage with the digital swarm. Access exclusive updates and community drops.", link: "https://twitter.com", linkText: "OPEN X" },
  { sub: "//// GALLERY_01", title: "INSTAGRAM", desc: "High fidelity storytelling. Explore our creative iterations and cinematic portfolio.", link: "https://instagram.com", linkText: "OPEN INSTAGRAM" },
  { sub: "//// COMMS_01", title: "CONTACT", desc: "Initiate a secure transmission. Let's collaborate and bring your vision to life.", link: "/contact", linkText: "SECURE TRANSMISSION" }
];

const getInitialIntroState = () => {
  try {
    return typeof window !== 'undefined' && sessionStorage.getItem('renderdrops_intro') === 'true';
  } catch (e) {
    return false;
  }
};

const HomePage: React.FC = () => {
  const hasPlayedIntro = getInitialIntroState();
  const [appState, setAppState] = useState<'scanning' | 'ready' | 'active'>(hasPlayedIntro ? 'active' : 'scanning');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for engine to be ready
    const checkEngine = setInterval(() => {
      if (window.rdEngine && window.rdEngine.isReady) {
        if (!hasPlayedIntro) setAppState('ready');
        clearInterval(checkEngine);
      }
    }, 100);

    return () => clearInterval(checkEngine);
  }, [hasPlayedIntro]);

  useEffect(() => {
    if (appState !== 'active') return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = Math.max(container.scrollHeight - container.clientHeight, 1);
      const progress = Math.min(Math.max(container.scrollTop / maxScroll, 0), 1);
      setScrollProgress(progress);

      // 5 phases (0, 1, 2, 3, 4)
      let newPhase = Math.floor(progress / 0.2001); 
      if(newPhase > 4) newPhase = 4;

      if(newPhase !== activePhase) {
        setActivePhase(newPhase);
        if (window.rdEngine) {
          window.rdEngine.setPhase(newPhase);
        }
      }

      if (window.rdEngine) {
        window.rdEngine.setCameraZ(-Math.sin(progress * Math.PI) * 15);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [appState, activePhase]);

  const handleStartEngine = () => {
    setAppState('active');
    if (window.rdEngine) {
      window.rdEngine.triggerIntro();
    }
  };

  // Handle clicking on the invisible scroll container
  const handleContainerClick = (e: React.MouseEvent) => {
    if (window.rdEngine && window.rdEngine.handleClick) {
      window.rdEngine.handleClick(e.clientX, e.clientY, () => {
        const link = phaseData[activePhase].link;
        if (link) {
          if (link.startsWith('/')) {
            navigate(link);
          } else {
            window.open(link, '_blank');
          }
        }
      });
    }
  };

  const handleActionClick = () => {
    setModalOpen(true);
    if (window.rdEngine) {
      window.rdEngine.setCameraZ(15); // Push camera in when modal opens
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    if (window.rdEngine) {
      window.rdEngine.setCameraZ(0); // Reset camera
    }
  };

  const executeLink = () => {
    const link = phaseData[activePhase].link;
    if (link) {
      if (link.startsWith('/')) {
        navigate(link);
      } else {
        window.open(link, '_blank');
      }
    }
    closeModal();
  };

  return (
    <div data-testid="home-page" className="relative w-full h-screen overflow-hidden">
      
      {/* Invisible Scroll Container - Clickable to trigger 3D zoom */}
      <div 
        ref={scrollContainerRef}
        onClick={handleContainerClick}
        className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden z-20 custom-scrollbar cursor-pointer"
        style={{ display: appState === 'active' && !modalOpen ? 'block' : 'none' }}
      >
        <div className="w-full h-[500vh]" />
      </div>

      {/* Start Screen */}
      <AnimatePresence>
        {(appState === 'scanning' || appState === 'ready') && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)] flex flex-col items-center justify-center"
          >
            <div className="font-mono text-xs text-[#FF0033] mb-6 text-center animate-pulse tracking-widest">
              AWAITING KERNEL IGNITION...
            </div>
            <button 
              onClick={handleStartEngine}
              disabled={appState === 'scanning'}
              className={`font-mono text-sm tracking-[6px] px-14 py-5 border rounded-sm transition-all duration-500 relative overflow-hidden group z-50 ${
                appState === 'scanning' 
                  ? 'border-white/15 text-white/30 cursor-not-allowed bg-transparent' 
                  : 'border-white/15 text-white hover:border-[#FF0033] hover:text-[#FF0033] hover:shadow-[0_0_40px_rgba(255,0,51,0.4)] hover:bg-[#FF0033]/5 hover:tracking-[8px] cursor-pointer'
              }`}
            >
              <span className="relative z-10">
                {appState === 'scanning' ? 'LOADING MATRIX' : 'INITIATE'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main HUD */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: appState === 'active' ? 1 : 0 }}
        transition={{ duration: 1.5, delay: hasPlayedIntro ? 0 : 2.5 }}
        className="fixed inset-0 z-10 flex flex-col justify-between p-6 md:p-12 box-border pointer-events-none"
      >
        <header className="flex justify-between items-start w-full mt-20">
          <div className="pointer-events-auto cursor-pointer" onClick={handleActionClick}>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-2">
              <span className="w-3 h-3 bg-[#FF0033] inline-block animate-pulse shadow-[0_0_20px_#FF0033]"></span>
              <span className="text-[#FF0033]">RENDER</span><span className="text-white">DROPS</span>
            </h1>
            <p className="font-mono text-[10px] text-neutral-500 mt-2">// CINEMATIC CORE ACTIVE</p>
          </div>
          <div className="hidden md:block text-right">
            <h3 className="font-mono text-[10px] text-[#FF0033] mb-1">////// DATA STREAM</h3>
            <p className="font-mono text-[10px] text-neutral-500">
              NODES: 50,000
            </p>
          </div>
        </header>

        <main className="w-full flex justify-between items-center pointer-events-none">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-mono text-[10px] text-[#FF0033] mb-2 tracking-widest opacity-80">{phaseData[activePhase].sub}</p>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase drop-shadow-2xl tracking-tight">
                  {phaseData[activePhase].title}
                </h2>
                <div className="border-l-2 border-[#FF0033] pl-6">
                  <p className="font-mono text-xs text-neutral-400 leading-loose max-w-sm">
                    {phaseData[activePhase].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="flex justify-between items-end w-full mb-4">
          <p className="font-mono text-[10px] text-neutral-500 hidden md:block opacity-70">SCROLL TO EXPLORE // CLICK PARTICLES TO ENTER</p>
          <div className="font-mono text-[10px] text-neutral-500 flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="text-white font-bold">[{Math.round(scrollProgress * 100).toString().padStart(3, '0')}%]</span>
            <div className="w-48 h-[2px] bg-white/10 overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-[#FF0033] transition-all duration-100" 
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </footer>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-w-2xl w-full p-12 relative bg-[#050505] border border-white/5 rounded-2xl shadow-[0_0_100px_rgba(255,0,51,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal}
                className="absolute top-8 right-8 font-mono text-xs text-neutral-500 hover:text-white transition-colors"
              >
                [X] CLOSE
              </button>
              <div className="border-l-[3px] border-[#FF0033] pl-8">
                <h3 className="font-mono text-[#FF0033] text-xs mb-4 tracking-widest">//// IDENTIFIED</h3>
                <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-8">
                  {phaseData[activePhase].title}
                </h2>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-xl mb-10">
                  <p className="font-mono text-sm text-neutral-400 leading-loose">
                    {phaseData[activePhase].desc}
                  </p>
                </div>
                <button 
                  onClick={executeLink}
                  className="font-mono text-xs bg-[#FF0033] text-white px-8 py-4 rounded hover:bg-white hover:text-black transition-colors w-full sm:w-auto font-bold tracking-widest shadow-[0_0_30px_rgba(255,0,51,0.3)]"
                >
                  {phaseData[activePhase].linkText} ↗
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
