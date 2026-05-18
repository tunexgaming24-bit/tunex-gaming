
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Users, Star, Trophy, ArrowRight, X, Info, Gamepad2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const { homeConfig } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (homeConfig.apkLink) {
      const link = document.createElement('a');
      link.href = homeConfig.apkLink;
      link.download = homeConfig.apkLink.split('/').pop() || 'app.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstructions(true);
    }
  };

  const handleEnterApp = () => {
    window.dispatchEvent(new CustomEvent('nav-to-auth'));
  };

  return (
    <div className="min-h-screen bg-[#060810] flex flex-col items-center px-6 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[300px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* App Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-12"
      >
        <div className="w-28 h-28 flex items-center justify-center relative group">
           <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
           <div className="w-full h-full flex items-center justify-center p-2">
              {homeConfig.appLogo ? (
                <img 
                  src={homeConfig.appLogo} 
                  alt={homeConfig.appName} 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]" 
                />
              ) : (
                <div className="w-full h-full bg-blue-600/20 rounded-3xl flex items-center justify-center">
                  <Gamepad2 size={48} className="text-blue-500" />
                </div>
              )}
           </div>
        </div>
      </motion.div>

      {/* Main Title Section */}
      <div className="text-center relative z-10 mb-12">
         <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="text-blue-400 text-lg font-bold mb-2 tracking-wide"
         >
           বাংলাদেশের
         </motion.p>
         <motion.h1 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-6"
         >
           #১ গেমিং প্ল্যাটফর্ম
         </motion.h1>
         
         <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-medium">
            <span>খেলুন</span>
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
            <span>জিতুন</span>
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
            <span>উপভোগ করুন</span>
         </div>
      </div>

      {/* Main CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10 mb-16 px-4"
      >
         <button 
           onClick={handleInstall}
           className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-5 rounded-2xl flex items-center justify-center gap-4 text-white font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-sm italic mb-4"
         >
            <Download size={20} className="animate-bounce" />
            অ্যাপ ডাউনলোড করুন
         </button>

         <button 
           onClick={handleEnterApp}
           className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
         >
            ব্রাউজার থেকে খেলুন <ArrowRight size={12} />
         </button>
         
         <div className="mt-8 flex items-center justify-center gap-2 text-[8px] text-gray-500 font-bold uppercase tracking-widest">
            <div className="w-8 h-px bg-gray-800" />
            <span>START EARNING REAL CASH TODAY</span>
            <div className="w-8 h-px bg-gray-800" />
         </div>
      </motion.div>

      {/* Features Grid */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-4 relative z-10 mb-12">
         {[
           { 
             label: '৳১০লক্ষ+', 
             desc: 'Downloads', 
             icon: <Download size={22} />, 
             color: 'from-blue-500/10 to-blue-900/20',
             iconColor: 'bg-blue-600',
             dotColor: 'bg-blue-400'
           },
           { 
             label: '১লক্ষ+', 
             desc: 'Regular Players', 
             icon: <Users size={22} />, 
             color: 'from-green-500/10 to-green-900/20',
             iconColor: 'bg-green-600',
             dotColor: 'bg-green-400'
           },
           { 
             label: '২৪/৭', 
             desc: 'Support', 
             icon: <Star size={22} />, 
             color: 'from-purple-500/10 to-purple-900/20',
             iconColor: 'bg-purple-600',
             dotColor: 'bg-purple-400'
           },
           { 
             label: '১০+', 
             desc: 'Games & Modes', 
             icon: <Trophy size={22} />, 
             color: 'from-orange-500/10 to-orange-900/20',
             iconColor: 'bg-orange-600',
             dotColor: 'bg-orange-400'
           },
         ].map((stat, idx) => (
           <motion.div 
             key={idx}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className={`relative p-6 bg-gradient-to-b ${stat.color} rounded-[2rem] border border-white/5 flex flex-col items-center text-center group backdrop-blur-sm`}
           >
              <div className={`absolute top-2 right-2 w-1.5 h-1.5 ${stat.dotColor} rounded-full opacity-50`} />
              <div className={`w-12 h-12 ${stat.iconColor} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-black/40`}>
                 {stat.icon}
              </div>
              <h4 className="text-xl font-black text-white italic tracking-tighter mb-1">{stat.label}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{stat.desc}</p>
           </motion.div>
         ))}
      </div>

      <div className="relative z-10 text-center pb-8 border-t border-white/5 w-full pt-8 mt-4">
         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] mb-2">{homeConfig.appName} OFFICIAL</p>
         <div className="flex items-center justify-center gap-4 text-gray-800">
            <div className="w-1 h-1 bg-current rounded-full" />
            <div className="w-1 h-1 bg-current rounded-full" />
            <div className="w-1 h-1 bg-current rounded-full" />
         </div>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowInstructions(false)}
               className="absolute inset-0 bg-[#060810]/95 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-[#0d1425] border border-blue-500/20 w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 overflow-hidden"
             >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-transparent" />
                
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-2 text-blue-500">
                      <Download size={20} />
                      <span className="text-xs font-black uppercase tracking-widest italic">Installation Guide</span>
                   </div>
                   <button onClick={() => setShowInstructions(false)} className="text-gray-500 hover:text-white">
                      <X size={20} />
                   </button>
                </div>

                <div className="space-y-6">
                   <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                      <p className="text-[12px] text-gray-300 font-bold leading-relaxed">
                         আপনার ফোনে অ্যাপটি ইন্সটল করতে নিচের ধাপগুলো অনুসরণ করুন। এটি সরাসরি আপনার ফোনের হোম স্ক্রিনে প্রিমিয়াম অ্যাপ হিসেবে যোগ হবে।
                      </p>
                   </div>

                   <div className="flex flex-col gap-4">
                      <div className="flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-blue-500 shadow-inner">১</div>
                         <div>
                            <p className="text-[11px] text-white font-black uppercase italic">ব্রাউজার মেনু</p>
                            <p className="text-[9px] text-gray-500 font-bold">উপরে ডানদিকের (৩ ডট) বাটনে ক্লিক করুন</p>
                         </div>
                      </div>
                      <div className="flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-blue-500 shadow-inner">২</div>
                         <div>
                            <p className="text-[11px] text-white font-black uppercase italic">ইন্সটল অ্যাপ</p>
                            <p className="text-[9px] text-gray-500 font-bold">"Install App" অথবা "Add to Home Screen" এ ক্লিক করুন</p>
                         </div>
                      </div>
                      <div className="flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-blue-500 shadow-inner">৩</div>
                         <div>
                            <p className="text-[11px] text-white font-black uppercase italic">কনফার্ম করুন</p>
                            <p className="text-[9px] text-gray-500 font-bold">"Add" অথবা "Install" বাটনে ক্লিক করে শেষ করুন</p>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => setShowInstructions(false)}
                     className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] italic shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                   >
                      বুঝেছি, ধন্যবাদ
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
