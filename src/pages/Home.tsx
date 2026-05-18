import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Wallet, MessageCircle, ChevronRight, Gamepad2, LayoutGrid, Zap, Users, Trophy, DollarSign, Play } from 'lucide-react';
import { GlassCard, StatCard } from '../components/SharedUI';
import { motion, AnimatePresence } from 'motion/react';
import { FAKE_LEADERS } from '../data/mockData';

const SectionHeader: React.FC<{ 
  title: string; 
  subtitle?: string; 
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-end mb-4 px-1">
    <div>
      <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">{title}</h3>
      {subtitle && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Home: React.FC = () => {
  const { user, setPage, homeConfig, tournaments, setActiveGame, participations, setSelectedTournament, users } = useApp();
  const [activeTab, setActiveTab ] = useState<'games' | 'others'>('games');
  const [currentBanner, setCurrentBanner] = useState(0);

  const bannerImages = homeConfig.banners;

  useEffect(() => {
    if (bannerImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const handleGameClick = (game: string) => {
    setActiveGame(game);
    setPage('tournaments');
  };

  const getMatchCount = (game: string) => {
    return tournaments.filter(t => t.game === game && (t.status === 'UPCOMING' || t.status === 'LIVE')).length;
  };

  const liveMatches = tournaments.filter(t => t.status === 'LIVE');

  const myJoinedTournaments = tournaments.filter(t => 
    participations.some(p => p.userId === user?.id && p.tournamentId === t.id)
  ).sort((a, b) => {
    if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
    if (a.status !== 'LIVE' && b.status === 'LIVE') return 1;
    return 0;
  });

  if (homeConfig.maintenanceMode && user.role === 'USER') {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Zap size={48} className="text-red-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">Under Maintenance</h2>
        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
          WE ARE CURRENTLY UPDATING THE SYSTEM TO PROVIDE A BETTER EXPERIENCE. PLEASE CHECK BACK SOON!
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 min-h-screen bg-[#0A0A0B]">
      {/* Ticker Announcement */}
      {homeConfig.tickerAnnouncement && (
        <div className="mb-6 bg-blue-600/10 border-y border-blue-500/20 py-2 overflow-hidden flex items-center rounded-xl">
           <div className="flex-shrink-0 px-4 bg-[#0A0A0B]/50 backdrop-blur-md z-10">
              <span className="text-[10px] font-black text-blue-500 uppercase italic tracking-widest flex items-center gap-1">
                 <Zap size={10} fill="currentColor" /> NEWS:
              </span>
           </div>
           <div className="whitespace-nowrap animate-marquee flex-1">
              <span className="inline-block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                {homeConfig.tickerAnnouncement} • {homeConfig.tickerAnnouncement} • {homeConfig.tickerAnnouncement}
              </span>
           </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-4">
          <div className="relative">
             <div className="w-12 h-12 bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-xl group cursor-pointer active:scale-95 transition-transform" onClick={() => setPage('profile')}>
                {user.avatar ? (
                   <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full bg-[#151619] flex items-center justify-center">
                      <Users size={24} className="text-white/20" />
                   </div>
                )}
             </div>
             {homeConfig.appLogo && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#0A0A0B] rounded-lg border border-white/10 p-0.5 shadow-lg overflow-hidden">
                   <img src={homeConfig.appLogo} alt={homeConfig.appName} className="w-full h-full object-contain" />
                </div>
             )}
          </div>
          <div>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] leading-none mb-1">{homeConfig.appName}</p>
            <h1 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{user.name.split(' ')[0]}</h1>
          </div>
        </div>
        
        <motion.div 
          onClick={() => setPage('wallet')}
          className="pl-4 pr-1.5 py-1.5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-all shadow-lg"
        >
           <span className="text-sm font-black text-white tracking-tighter italic">৳{user.coins.toFixed(0)}</span>
           <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Wallet size={16} />
           </div>
        </motion.div>
      </div>

      {/* Low Balance Alert */}
      {user.coins < 10 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-[2rem] flex items-center justify-between"
        >
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                 <DollarSign size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white uppercase italic">Low Balance</p>
                 <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Top up to join matches</p>
              </div>
           </div>
           <button 
             onClick={() => setPage('wallet')}
             className="px-4 py-2 bg-orange-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20"
           >
              Add Cash
           </button>
        </motion.div>
      )}

      {/* LIVE NOW Section */}
      {liveMatches.length > 0 && (
        <div className="mb-10">
          <SectionHeader 
            title="Live Matches" 
            subtitle="Real-time arena battles" 
            action={
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase italic px-3 py-1 bg-red-500/10 rounded-full border border-red-500/10">
                 <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                 {liveMatches.length} LIVE
              </div>
            }
          />
          <div className="grid grid-cols-1 gap-3">
             {liveMatches.slice(0, 3).map(t => (
               <GlassCard 
                  key={t.id} 
                  className="p-4 border-red-500/20 bg-red-500/[0.02] group hover:bg-red-500/[0.05] transition-all"
                  onClick={() => {
                    setSelectedTournament(t);
                    setPage('match-details');
                  }}
               >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                          <img src={t.banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0A0A0B] shadow-lg animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase italic truncate max-w-[150px]">{t.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[8px] text-red-400 font-bold uppercase tracking-widest leading-none">In Battle</span>
                           <span className="w-0.5 h-0.5 bg-white/20 rounded-full" />
                           <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none">৳{t.totalPrize} prize</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-800 group-hover:text-red-500 transition-colors" />
                  </div>
               </GlassCard>
             ))}
          </div>
        </div>
      )}

      {/* Hero Slider */}
      <div className="relative mb-10 h-48 rounded-[2rem] overflow-hidden border border-white/5 group shadow-2xl">
        <AnimatePresence mode="wait">
          {bannerImages[currentBanner]?.image && bannerImages[currentBanner].image.length > 0 ? (
            <motion.img
              key={currentBanner}
              src={bannerImages[currentBanner].image}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={() => {
                if (bannerImages[currentBanner].link) window.open(bannerImages[currentBanner].link, '_blank');
              }}
            />
          ) : (
            <motion.div 
              key="fallback"
              className="absolute inset-0 bg-blue-600/20 flex items-center justify-center"
            >
               <Gamepad2 size={64} className="text-white/10" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
        
        {/* Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {bannerImages.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentBanner === idx ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      {/* Browse Games */}
      <div className="mb-6">
        <SectionHeader 
          title="Battle Zones" 
          subtitle="Choose your favorite arena" 
        />
        <div className="space-y-4">
          {homeConfig.categories.map((cat) => (
            <motion.div 
              key={cat.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGameClick(cat.game)}
              className="relative h-44 rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer shadow-xl group"
            >
              {cat.image && cat.image.length > 0 ? (
                <img 
                  src={cat.image} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                   <Gamepad2 size={48} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-x-8 inset-y-0 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-lg shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-md">
                  <Gamepad2 size={24} className="text-blue-500" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white italic tracking-tighter leading-tight uppercase">{cat.name}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{getMatchCount(cat.game)} Open</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support Quick Links */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button 
          onClick={() => window.open(homeConfig.telegramLink, '_blank')}
          className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-[2rem] flex flex-col items-center gap-3 transition-transform active:scale-95"
        >
          <MessageCircle size={28} className="text-blue-500" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Telegram Help</span>
        </button>
        <button 
          onClick={() => window.open(homeConfig.telegramGroupLink, '_blank')}
          className="p-5 bg-blue-600/10 border border-blue-600/20 rounded-[2rem] flex flex-col items-center gap-3 transition-transform active:scale-95"
        >
          <Zap size={28} fill="currentColor" className="text-blue-500" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Telegram Group</span>
        </button>
      </div>

      {/* Join Guide */}
      <GlassCard className="p-8 border-blue-500/20 bg-blue-500/[0.02]">
         <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">How To <span className="text-blue-500">Join Match</span></h3>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
         </div>
         <div className="space-y-6">
            {[
              { step: '01', title: 'Pick a Match', desc: 'Select your favorite game mode and click on an upcoming match.' },
              { step: '02', title: 'Join Now', desc: 'Register by providing your in-game name and paying the entry fee.' },
              { step: '03', title: 'Get Room ID', desc: 'Room ID & Pass will be sent via notification 15 mins before start.' },
              { step: '04', title: 'Win & Earn', desc: 'Play your best! Prizes are automatically added to your wallet.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                 <div className="text-xl font-black text-blue-500/20 italic tracking-tighter shrink-0">{item.step}</div>
                 <div>
                    <h4 className="text-xs font-black text-white uppercase italic mb-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide leading-relaxed">{item.desc}</p>
                 </div>
              </div>
            ))}
         </div>
         <button 
           onClick={() => window.open(homeConfig.youtubeLink, '_blank')}
           className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-white group"
         >
            <Play size={16} fill="currentColor" className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Watch Video Tutorial</span>
         </button>
      </GlassCard>

      <div className="mt-12 text-center pb-10">
         <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] mb-2">{homeConfig.appName} ESCAPE</p>
         <p className="text-[8px] text-gray-800 font-bold uppercase">Developed by AI Studio Build</p>
      </div>
    </div>
  );
};

export default Home;
