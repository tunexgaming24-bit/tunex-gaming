import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, User, Gamepad2, Wallet, Bell } from 'lucide-react';
import { motion } from 'motion/react';

const BottomNav: React.FC = () => {
  const { page, setPage } = useApp();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tournaments', icon: Gamepad2, label: 'Arena' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto bg-[#1A1A1D]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden h-20">
        <div className="flex h-full items-center justify-around px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = page === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage(tab.id as any)}
                className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all duration-300 ${isActive ? 'text-blue-500' : 'text-gray-600'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-blue-500/10 rounded-2xl border border-blue-500/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <Icon size={isActive ? 24 : 22} className={`relative z-10 ${isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
                {isActive && (
                   <motion.span 
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-[8px] font-black uppercase tracking-widest mt-1 relative z-10 italic"
                   >
                     {tab.label}
                   </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
