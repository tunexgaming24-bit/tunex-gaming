import React from 'react';
import { motion } from 'motion/react';

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'; className?: string }> = ({ 
  children, 
  variant = 'primary',
  className = ''
}) => {
  const variants = {
    primary: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    secondary: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    outline: 'bg-transparent text-gray-400 border-white/10',
    success: 'bg-green-600/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-600/20 text-red-400 border-red-500/30',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const GradientButton: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'; 
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  fullWidth = false,
  disabled = false,
  type = 'button'
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]',
    secondary: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    ghost: 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`relative overflow-hidden px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-wider transition-all duration-300 ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'active:scale-95'} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; id?: string; onClick?: () => void }> = ({ children, className = '', id, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    id={id}
    onClick={onClick}
    className={`bg-[#1A1A1D]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

export const StatCard: React.FC<{ label: string; value: string | number; icon?: React.ReactNode; color?: string }> = ({ label, value, icon, color = 'blue' }) => {
  const colors: Record<string, string> = {
    blue: 'from-blue-600/10 to-blue-600/5 text-blue-500 border-blue-500/20',
    purple: 'from-purple-600/10 to-purple-600/5 text-purple-500 border-purple-500/20',
    green: 'from-green-600/10 to-green-600/5 text-green-500 border-green-500/20',
    yellow: 'from-yellow-600/10 to-yellow-600/5 text-yellow-500 border-yellow-500/20',
    red: 'from-red-600/10 to-red-600/5 text-red-500 border-red-500/20',
  };

  return (
    <GlassCard className={`p-4 bg-gradient-to-br ${colors[color]}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
          <h3 className="text-xl font-black italic tracking-tighter text-white">{value}</h3>
        </div>
        {icon && <div className="p-2 bg-white/5 rounded-lg">{icon}</div>}
      </div>
    </GlassCard>
  );
};

export const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-4 border-white/5 border-t-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
    />
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">Initializing Battle Station...</p>
  </div>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-end mb-6 px-1">
    <div>
      <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">
        {(title || '').split(' ')[0]} <span className="text-blue-500">{(title || '').split(' ').slice(1).join(' ')}</span>
      </h2>
      {subtitle && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
