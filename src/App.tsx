
import { useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Tournaments from './pages/Tournaments';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import MatchDetails from './pages/MatchDetails';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function App() {
  const { user, isLoading, page, homeConfig } = useApp();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const handleNav = () => setShowLanding(false);
    window.addEventListener('nav-to-auth', handleNav);
    return () => window.removeEventListener('nav-to-auth', handleNav);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0A0A0B] flex flex-col items-center justify-center">
        <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 mb-8 relative"
        >
           {homeConfig.appLogo ? (
             <img 
               src={homeConfig.appLogo} 
               alt={homeConfig.appName} 
               className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
             />
           ) : (
             <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
             </div>
           )}
        </motion.div>
        <h2 className="text-2xl font-black text-white italic tracking-widest uppercase">{homeConfig.appName.split(' ')[0]} <span className="text-blue-500">{homeConfig.appName.split(' ')[1] || 'Arena'}</span></h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Initializing Arena...</p>
      </div>
    );
  }

  // Maintenance Screen
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'SUB_ADMIN';
  if (homeConfig.maintenanceMode && !isAdmin) {
    return (
      <div className="h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-8 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
           <motion.div
             animate={{ rotate: [0, 10, -10, 0] }}
             transition={{ duration: 0.5, repeat: Infinity }}
           >
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
           </motion.div>
        </div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Under<br /><span className="text-yellow-500">Maintenance</span></h2>
        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10 max-w-xs">Our engineers are upgrading the arena for better performance. We'll be back shortly.</p>
        <div className="space-y-4 w-full">
           <a href={homeConfig.telegramLink} className="block w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-colors">Join Support Group</a>
        </div>
      </div>
    );
  }

  if (!user) {
    return showLanding ? <Landing /> : <Auth />;
  }

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home />;
      case 'tournaments': return <Tournaments />;
      case 'match-details': return <MatchDetails />;
      case 'wallet': return <Wallet />;
      case 'notifications': return <Notifications />;
      case 'profile': return <Profile />;
      case 'admin': return <Admin />;
      default: return <Home />;
    }
  };

  const showBottomNav = !['match-details', 'admin'].includes(page);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px]" 
          />
          <motion.div 
             animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[120px]" 
          />
      </div>

      <main className="max-w-md mx-auto min-h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {showBottomNav && (
        <BottomNav />
      )}
    </div>
  );
}
