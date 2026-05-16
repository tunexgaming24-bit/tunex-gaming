import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle, Info, AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/SharedUI';
import { motion, AnimatePresence } from 'motion/react';

const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, setNotifications, setPage } = useApp();

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle size={20} className="text-green-500" />;
      case 'WARNING': return <AlertTriangle size={20} className="text-yellow-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="pb-24 px-4 pt-4 min-h-screen bg-[#0A0A0B]">
      <div className="flex justify-between items-center mb-10 px-1">
        <div className="flex items-center gap-4">
           <button onClick={() => setPage('home')} className="p-3 bg-white/5 rounded-2xl text-white border border-white/5 active:scale-90">
              <ArrowLeft size={20} />
           </button>
           <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">System<br /><span className="text-blue-500">Alerts</span></h2>
        </div>
        <button 
          onClick={clearAll}
          className="p-3 bg-white/5 rounded-2xl text-gray-600 hover:text-red-400 transition-all border border-white/5 active:scale-95"
        >
            <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((n, idx) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard 
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-5 transition-all duration-300 relative overflow-hidden ${!n.read ? 'border-blue-500/30 bg-blue-500/[0.03] shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'border-white/5 opacity-60'}`}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${!n.read ? 'bg-blue-600/10 shadow-inner border border-blue-500/20' : 'bg-white/5 uppercase'}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-black uppercase tracking-wider transition-colors ${!n.read ? 'text-white' : 'text-gray-500'}`}>
                          {n.title}
                        </h4>
                        {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] mt-1" />}
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed mb-1">{n.message}</p>
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{n.time}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-32 text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Bell size={32} className="text-gray-800" />
              </div>
              <p className="text-gray-600 font-bold uppercase tracking-widest text-xs italic">All clear! No alerts</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
