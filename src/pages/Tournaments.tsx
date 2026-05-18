import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Play, LayoutGrid, Zap, Trophy } from 'lucide-react';
import TournamentCard from '../components/TournamentCard';
import { motion } from 'motion/react';

const Tournaments: React.FC = () => {
  const { tournaments, setPage, setSelectedTournament, activeGame, setActiveGame, homeConfig } = useApp();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ONGOING' | 'RESULTS'>('ONGOING');

  const activeGameId = homeConfig.categories.find(c => c.game === activeGame)?.id;
  const activeModes = homeConfig.modes.filter(mode => mode.parentId === activeGameId);

  const getFilteredCount = (categoryName: string) => {
    return tournaments.filter(t => 
      t.game === activeGame && 
      t.category.toLowerCase() === categoryName.toLowerCase() &&
      t.status === 'UPCOMING'
    ).length;
  };

  const filteredTournaments = tournaments
    .filter(t => 
      t.game === activeGame &&
      (selectedMode ? t.category.toLowerCase() === selectedMode.toLowerCase() : true) &&
      (activeTab === 'ONGOING' ? (t.status === 'UPCOMING' || t.status === 'LIVE') : t.status === 'COMPLETED')
    )
    .sort((a, b) => {
      // Prioritize LIVE matches
      if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
      if (a.status !== 'LIVE' && b.status === 'LIVE') return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

  const handleBack = () => {
    if (selectedMode) {
      setSelectedMode(null);
    } else if (activeGame) {
      setActiveGame(null);
    } else {
      setPage('home');
    }
  };

  if (!activeGame) {
    return (
      <div className="pb-24 px-4 pt-4 min-h-screen bg-[#0A0A0B]">
        <div className="flex items-center justify-between mb-8">
           <button onClick={() => setPage('home')} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 active:scale-90">
              <ArrowLeft size={20} className="text-white" />
           </button>
           <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Select Game</h2>
           <div className="w-10 h-10"></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {homeConfig.categories.map((cat, idx) => (
             <motion.div
               key={cat.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setActiveGame(cat.game)}
               className="relative h-32 rounded-[2rem] overflow-hidden border border-white/5 cursor-pointer shadow-xl group"
             >
                <img src={cat.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-center">
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-lg">{cat.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest leading-none">{tournaments.filter(t => t.game === cat.game && t.status !== 'COMPLETED').length} Active Matches</p>
                   </div>
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                  <Play size={16} fill="white" className="ml-1" />
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    );
  }

  if (!selectedMode) {
    return (
      <div className="pb-24 px-4 pt-4 min-h-screen bg-[#0A0A0B]">
        <div className="flex items-center justify-between mb-8">
           <button onClick={handleBack} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 active:scale-90">
              <ArrowLeft size={20} className="text-white" />
           </button>
           <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">{activeGame || 'Arena'}</h2>
           <button className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center border border-white/5 active:scale-90 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Play size={18} fill="white" className="text-white ml-1" />
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {activeModes.map((mode, idx) => (
             <motion.div
               key={mode.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setSelectedMode(mode.name)}
               className="relative h-48 rounded-[1.5rem] overflow-hidden border border-white/10 cursor-pointer shadow-lg group"
             >
                {mode.image && mode.image.length > 0 ? (
                  <img src={mode.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                ) : (
                  <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center opacity-60">
                    <Zap size={48} className="text-white/20" />
                  </div>
                )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
               <div className="absolute inset-0 p-4 flex flex-col justify-end items-center text-center">
                  <h3 className="text-sm font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-md">{mode.name}</h3>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-80">{getFilteredCount(mode.name)} matches available</p>
               </div>
             </motion.div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 min-h-screen bg-[#0A0A0B]">
      <div className="flex items-center justify-between mb-8">
         <button onClick={handleBack} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 active:scale-90 transition-transform">
            <ArrowLeft size={20} className="text-white" />
         </button>
         <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">{selectedMode}</h2>
         <div className="w-10 h-10"></div> {/* Spacer */}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/5 mb-8">
         <button 
           onClick={() => setActiveTab('ONGOING')}
           className={`flex-1 pb-4 flex items-center justify-center gap-2 transition-all relative ${activeTab === 'ONGOING' ? 'text-yellow-500' : 'text-gray-500'}`}
         >
           <Zap size={16} fill={activeTab === 'ONGOING' ? 'currentColor' : 'none'} />
           <span className="text-[12px] font-black uppercase tracking-[0.2em] italic">Ongoing</span>
           {activeTab === 'ONGOING' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500" />}
         </button>
         <button 
           onClick={() => setActiveTab('RESULTS')}
           className={`flex-1 pb-4 flex items-center justify-center gap-2 transition-all relative ${activeTab === 'RESULTS' ? 'text-yellow-500' : 'text-gray-500'}`}
         >
           <Trophy size={16} fill={activeTab === 'RESULTS' ? 'currentColor' : 'none'} />
           <span className="text-[12px] font-black uppercase tracking-[0.2em] italic">Results</span>
           {activeTab === 'RESULTS' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500" />}
         </button>
      </div>

      <div className="space-y-2">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((t) => (
            <TournamentCard 
              key={t.id} 
              tournament={t} 
              onClick={() => {
                setSelectedTournament(t);
                setPage('match-details');
              }} 
            />
          ))
        ) : (
          <div className="py-20 text-center">
             <LayoutGrid size={48} className="text-gray-800 mx-auto mb-4" />
             <p className="text-gray-600 font-bold uppercase tracking-widest text-xs italic">No matches found for this mode</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
