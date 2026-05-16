import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Shield, Mail, Lock, User as UserIcon, Gamepad2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GlassCard, GradientButton } from '../components/SharedUI';

const Auth: React.FC = () => {
  const [view, setView] = useState<'splash' | 'login' | 'signup'>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referral, setReferral] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, homeConfig } = useApp();

  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => setView('login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Artificial delay for professional feel and to ensure state sync
    setTimeout(() => {
      if (view === 'login') {
        login(email, password);
      } else {
        if (!name) {
          setIsLoading(false);
          return;
        }
        register(name, email, password, referral);
      }
      setIsLoading(false);
    }, 1000);
  };

  if (view === 'splash') {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          className="w-32 h-32 flex items-center justify-center relative mb-8"
        >
           <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full" />
           {homeConfig.appLogo ? (
             <img src={homeConfig.appLogo} alt={homeConfig.appName} className="w-full h-full object-contain relative z-10 z-10 filter drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
           ) : (
             <Gamepad2 size={64} className="text-white relative z-10" />
           )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
            Tunex <span className="text-blue-500">Gaming</span>
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.4em] italic mb-12">Ultimate Arena</p>
          
          <div className="flex gap-1 justify-center">
             {[0, 1, 2].map(i => (
                <motion.div 
                   key={i}
                   animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                   className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                />
             ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col p-8 overflow-hidden relative">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />

      <div className="mt-12 mb-12 relative z-10">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
           {view === 'login' ? 'Welcome' : 'Join the'}<br />
           <span className="text-blue-500">{view === 'login' ? 'Back' : 'Squad'}</span>
        </h2>
        <p className="text-xs text-gray-500 font-bold tracking-widest uppercase italic">
           {view === 'login' ? 'Sign in to your battle station' : 'Create your account for glory'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handleAuth}
          className="space-y-6 relative z-10"
        >
          <GlassCard className="p-8 space-y-6 bg-white/[0.02]">
            {view === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold"
                      placeholder="Enter Full Name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Referral Code (Optional)</label>
                  <div className="relative group">
                    <Zap className="absolute left-4 top-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      type="text" 
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold"
                      placeholder="e.g. TUNEX10"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {view === 'login' && (
              <div className="text-right">
                <button type="button" className="text-[10px] text-gray-500 font-black uppercase tracking-widest hover:text-blue-500">Forgot Password?</button>
              </div>
            )}
          </GlassCard>

          <GradientButton 
            type="submit" 
            fullWidth 
            disabled={isLoading}
            className={`h-16 rounded-[1.5rem] shadow-[0_15px_30px_rgba(59,130,246,0.3)] ${isLoading ? 'opacity-70 animate-pulse' : ''}`}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-black italic tracking-tighter uppercase">
                {isLoading ? 'Verifying Credentials...' : (view === 'login' ? 'Initialize Battle' : 'Begin Journey')}
              </span>
              {!isLoading && <ArrowRight size={20} />}
            </div>
          </GradientButton>

          <div className="text-center pt-8">
             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-loose">
               {view === 'login' ? "Don't have an account?" : "Already have an account?"}<br />
               <button 
                 type="button"
                 onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                 className="text-blue-500 font-black uppercase underline underline-offset-4 mt-2"
               >
                 {view === 'login' ? "Register Now" : "Login Instead"}
               </button>
             </p>
          </div>
        </motion.form>
      </AnimatePresence>

      <div className="mt-auto pt-8 flex items-center justify-center gap-2 opacity-30">
         <Shield size={14} className="text-gray-500" />
         <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Secured by Victory Core</span>
      </div>
    </div>
  );
};

export default Auth;
