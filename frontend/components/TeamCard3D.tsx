import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Team } from '../types';

interface TeamCard3DProps {
  team: Team;
}

const TeamCard3D: React.FC<TeamCard3DProps> = ({ team }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`team-card-${team.id}`}
      className="[perspective:1200px] w-full h-[500px] cursor-pointer"
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full [backface-visibility:hidden] border border-white/10 rounded-3xl overflow-hidden group bg-white/5">
          <div className="absolute inset-0 bg-[#FF0033]/5 group-hover:bg-[#FF0033]/10 transition-colors z-10 mix-blend-overlay" />
          
          <img
            src={team.image}
            alt={team.name}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <h3 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">
              {team.name}
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-medium">
              {team.description}
            </p>
            <div className="inline-block bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs tracking-wide uppercase group-hover:bg-[#FF0033] group-hover:text-white transition-colors shadow-lg">
              View Team
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full [backface-visibility:hidden] border border-white/10 rounded-3xl overflow-hidden bg-[#0a0a0a]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-full p-8 flex flex-col relative">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
              <div className="text-sm font-bold text-[#FF0033] mb-6 border-b border-white/10 pb-2 uppercase tracking-widest">
                {team.name} Roster
              </div>

              {/* Team Head */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-neutral-500 tracking-widest uppercase mb-4">
                  Team Lead
                </h4>
                <div className="flex items-center space-x-4 border border-white/10 p-4 rounded-2xl bg-white/5">
                  <img
                    src={team.teamHead.photo}
                    alt={team.teamHead.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#FF0033]"
                  />
                  <div>
                    <p className="text-sm font-bold text-white uppercase">{team.teamHead.name}</p>
                    <p className="text-xs font-medium text-[#FF0033]">{team.teamHead.role}</p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h4 className="text-xs font-bold text-neutral-500 tracking-widest uppercase mb-4">
                  Members
                </h4>
                <div className="space-y-3">
                  {team.members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-4 border border-white/5 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-white uppercase">{member.name}</p>
                        <p className="text-[10px] font-medium text-neutral-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="mt-6 w-full py-4 bg-white text-black font-bold text-xs tracking-widest uppercase rounded-full hover:bg-neutral-200 transition-colors relative z-10 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamCard3D;
