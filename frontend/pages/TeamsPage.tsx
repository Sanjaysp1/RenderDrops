import React from 'react';
import { motion } from 'framer-motion';
import TeamCard3D from '../components/TeamCard3D';
import { Team } from '../types';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const TeamsPage: React.FC = () => {
  const teams: Team[] = [
    {
      id: 'media',
      name: 'Media',
      description: 'Videography, photography, and professional editing to produce high-quality visual content.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
      teamHead: {
        name: 'Alex Johnson',
        role: 'Head of Media',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHlvdW5nJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjBmYWNlfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85',
      },
      members: [
        { name: 'Sarah Chen', role: 'Videographer', photo: 'https://images.unsplash.com/photo-1738085825887-507c05c58674?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
        { name: 'Marcus Williams', role: 'Photographer', photo: 'https://images.unsplash.com/photo-1614311127293-6d688e943662?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHxjb29sJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
        { name: 'Emma Davis', role: 'Editor', photo: 'https://images.pexels.com/photos/5940864/pexels-photo-5940864.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
      ],
    },
    {
      id: 'design',
      name: 'Design',
      description: 'Graphic design, branding, and creative communication for impactful storytelling.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
      teamHead: {
        name: 'Priya Sharma',
        role: 'Head of Design',
        photo: 'https://images.unsplash.com/photo-1738085825887-507c05c58674?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85',
      },
      members: [
        { name: 'Jake Martinez', role: 'Graphic Designer', photo: 'https://images.unsplash.com/photo-1614311127293-6d688e943662?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHxjb29sJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
        { name: 'Olivia Brown', role: 'Brand Strategist', photo: 'https://images.pexels.com/photos/5940864/pexels-photo-5940864.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
        { name: 'David Kim', role: 'UI/UX Designer', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHlvdW5nJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjBmYWNlfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
      ],
    },
    {
      id: 'vfx',
      name: 'VFX',
      description: 'Advanced visual effects and creative enhancements for cinematic output.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
      teamHead: {
        name: 'Ryan Foster',
        role: 'Head of VFX',
        photo: 'https://images.unsplash.com/photo-1614311127293-6d688e943662?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHxjb29sJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85',
      },
      members: [
        { name: 'Sophia Taylor', role: 'VFX Artist', photo: 'https://images.pexels.com/photos/5940864/pexels-photo-5940864.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
        { name: 'Ethan Moore', role: 'Motion Graphics', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHlvdW5nJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjBmYWNlfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
        { name: 'Ava Wilson', role: '3D Artist', photo: 'https://images.unsplash.com/photo-1738085825887-507c05c58674?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
      ],
    },
    {
      id: 'pr',
      name: 'PR',
      description: 'Brand outreach, collaborations, and audience engagement strategies.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop',
      teamHead: {
        name: 'Isabella Garcia',
        role: 'Head of PR',
        photo: 'https://images.pexels.com/photos/5940864/pexels-photo-5940864.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      },
      members: [
        { name: 'Liam Anderson', role: 'PR Manager', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHlvdW5nJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjBmYWNlfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
        { name: 'Mia Thompson', role: 'Social Media Lead', photo: 'https://images.unsplash.com/photo-1738085825887-507c05c58674?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
        { name: 'Noah Jackson', role: 'Content Strategist', photo: 'https://images.unsplash.com/photo-1614311127293-6d688e943662?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHxjb29sJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fHx8MTc3OTIwMTExNXww&ixlib=rb-4.1.0&q=85' },
      ],
    },
  ];

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      data-testid="teams-page" 
      className="min-h-screen pt-32 pb-20 relative bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-20 border-b border-white/10 pb-10">
          <p className="text-sm text-[#FF0033] font-bold mb-4 tracking-widest uppercase">Our Teams</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
            Network <span className="text-[#FF0033]">Nodes</span>
          </h1>
          <p className="text-base text-neutral-300 mt-6 max-w-2xl leading-loose font-medium">
            Explore our specialized teams to view operative rosters and specializations.
          </p>
        </motion.div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {teams.map((team) => (
            <motion.div key={team.id} variants={itemVariants}>
              <TeamCard3D team={team} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamsPage;
