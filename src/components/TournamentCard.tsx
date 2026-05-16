
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Tournament } from '../data/mockData';
import { GlassCard, Badge, GradientButton } from './SharedUI';
import { Clock, MapPin, Users, Trophy, Zap, MousePointer2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: () => void;
}

const CountdownTimer: React.FC<{ startTime: string, status: string }> = ({ startTime, status }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (status === 'COMPLETED' || status === 'LIVE') {
      setTimeLeft(status);
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = new Date(startTime).getTime() - now;

      if (distance < 0) {
        return 'EXPIRED';
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      return `${h}h : ${m}m : ${s}s`;
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, status]);

  return <span>{timeLeft}</span>;
};

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onClick }) => {
  const { participations, user } = useApp();

  const isJoined = participations.some(p => p.userId === user?.id && p.tournamentId === tournament.id);
  const slotsPercentage = (tournament.joinedSlots / tournament.totalSlots) * 100;
  const isFull = tournament.joinedSlots >= tournament.totalSlots;

  return (
    <GlassCard className="mb-6 group overflow-visible" onClick={onClick}>
      <div className="p-4">
        {/* Header Info */}
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-white/5 flex-shrink-0 flex items-center justify-center bg-white/5">
            {tournament.banner && tournament.banner.length > 0 ? (
              <img 
                src={tournament.banner} 
                alt={tournament.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Trophy size={24} className="text-white/10" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-white uppercase italic tracking-tighter truncate leading-tight group-hover:text-blue-400 transition-colors">
              {tournament.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={12} className="text-gray-500" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                {new Date(tournament.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, {new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="success" className="flex items-center gap-1">
                <MapPin size={8} /> Map: {tournament.map}
              </Badge>
              <Badge variant="primary">Type: {tournament.type}</Badge>
              {isJoined && <Badge variant="SUCCESS" className="animate-pulse">JOINED</Badge>}
              <motion.div whileHover={{ scale: 1.1 }}>
                <MousePointer2 size={12} className="text-blue-500" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Prize & Entry Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center py-2 bg-blue-500/[0.03] rounded-2xl border border-blue-500/10">
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.1em] mb-0.5">Total Prize</p>
            <p className="text-lg font-black text-blue-500 leading-none">৳{tournament.prizePool}</p>
            <div className="flex justify-center gap-1 mt-1 opacity-60">
               {tournament.prizes?.[0] && <span className="text-[7px] font-bold text-yellow-500">1st: ৳{tournament.prizes[0].prize}</span>}
               {tournament.prizes?.[1] && <span className="text-[7px] font-bold text-gray-400">2nd: ৳{tournament.prizes[1].prize}</span>}
            </div>
          </div>
          <div className="text-center py-2 bg-white/[0.03] rounded-2xl border border-white/5">
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.1em] mb-0.5">Per Kill</p>
            <p className="text-lg font-black text-white leading-none">৳{tournament.perKill}</p>
          </div>
          <div className="text-center py-2 bg-white/[0.03] rounded-2xl border border-white/5">
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.1em] mb-0.5">Entry Fee</p>
            <p className="text-lg font-black text-white leading-none">৳{tournament.entryFee}</p>
          </div>
        </div>

        {/* Slots Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5 px-1">
            <span className="text-[10px] text-blue-400 font-black uppercase tracking-wider">
              {tournament.totalSlots - tournament.joinedSlots} Players Need
            </span>
            <span className="text-[10px] text-gray-400 font-black">
              {tournament.joinedSlots}/{tournament.totalSlots}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${slotsPercentage}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className={`h-full bg-gradient-to-r ${isFull ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600'} shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
            />
          </div>
        </div>

        {/* Join Button */}
        <GradientButton 
          variant={isFull ? 'danger' : 'success'} 
          fullWidth 
          disabled={isFull}
          className="h-12 rounded-xl"
        >
          {isFull ? 'SOLTS FULL' : 'JOIN'}
        </GradientButton>
      </div>

      {/* Countdown Footer */}
      <div className={`py-3 px-4 flex items-center justify-center gap-3 ${isFull ? 'bg-red-500/20' : 'bg-green-500/20'} border-t border-white/5 transition-colors duration-500`}>
         <Clock size={14} className={isFull ? 'text-red-400' : 'text-green-400'} />
         <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Starts In:</span>
         <span className={`text-[12px] font-black ${isFull ? 'text-red-400' : 'text-white'} font-mono tracking-tighter`}>
           <CountdownTimer startTime={tournament.startTime} status={tournament.status} />
         </span>
      </div>
    </GlassCard>
  );
};

export default TournamentCard;
