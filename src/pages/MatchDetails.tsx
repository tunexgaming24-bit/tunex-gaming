import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Share2, Users, Trophy, DollarSign, Clock, Map, Shield, Lock, Zap, Plus, X, User, Gamepad2 } from 'lucide-react';
import { GlassCard, Badge, GradientButton, SectionHeader } from '../components/SharedUI';
import { motion, AnimatePresence } from 'motion/react';

const MatchDetails: React.FC = () => {
  const { selectedTournament, setPage, joinTournament, user, participations, updateTournament, addNotification } = useApp();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [gameName, setGameName] = useState('');
  const [teammates, setTeammates] = useState<string[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoinedSuccessfully, setIsJoinedSuccessfully] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openJoinModal = () => {
    setIsJoinedSuccessfully(false);
    setError(null);
    setShowJoinModal(true);
  };
  
  // Admin Editing state
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [newRule, setNewRule] = useState('');

  const isAdminOrHigher = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'SUB_ADMIN';

  if (!selectedTournament) return null;

  const userParticipation = participations.find(
    p => p.userId === user?.id && p.tournamentId === selectedTournament.id
  );

  const isFull = selectedTournament.joinedSlots >= selectedTournament.totalSlots;

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsJoining(true);
    
    // Simulate small delay for impact
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const result = joinTournament(selectedTournament.id, gameName, agreedToRules, teammates.filter(t => t.trim()));
    
    if (result.success) {
      setIsJoinedSuccessfully(true);
      // Wait a bit before potentially doing something else or let the user close it
    } else {
      setError(result.message || 'Something went wrong');
    }
    setIsJoining(false);
  };

  const handleAddTeammate = () => {
    if (selectedTournament.type === 'DUO' && teammates.length >= 1) return;
    if (selectedTournament.type === 'SQUAD' && teammates.length >= 3) return;
    setTeammates([...teammates, '']);
  };

  const updateTeammate = (index: number, val: string) => {
    const newTeammates = [...teammates];
    newTeammates[index] = val;
    setTeammates(newTeammates);
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    updateTournament(selectedTournament.id, { 
      rules: [...selectedTournament.rules, newRule.trim()] 
    });
    setNewRule('');
  };

  const removeRule = (idx: number) => {
    updateTournament(selectedTournament.id, { 
      rules: selectedTournament.rules.filter((_, i) => i !== idx) 
    });
  };

  return (
    <div className="pb-32 min-h-screen bg-[#0A0A0B]">
      {/* Banner & Header */}
      <div className="relative h-72 bg-white/5 flex items-center justify-center">
        {selectedTournament.banner && selectedTournament.banner.length > 0 ? (
          <img 
            src={selectedTournament.banner} 
            alt={selectedTournament.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <Gamepad2 size={64} className="text-white/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
        
        <div className="absolute top-4 inset-x-4 flex justify-between">
           <motion.button 
             whileTap={{ scale: 0.9 }}
             onClick={() => setPage('tournaments')}
             className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10"
           >
              <ArrowLeft size={20} className="text-white" />
           </motion.button>
           <motion.button 
             whileTap={{ scale: 0.9 }}
             className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10"
           >
              <Share2 size={20} className="text-white" />
           </motion.button>
        </div>

        <div className="absolute bottom-6 px-4 w-full">
            <Badge variant="secondary" className="mb-3">{selectedTournament.game.toUpperCase()}</Badge>
            <h2 className="text-3xl font-black text-white italic tracking-tighter leading-none uppercase drop-shadow-2xl">{selectedTournament.title}</h2>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 space-y-6">
          {/* Match Results (If Completed) */}
          {selectedTournament.status === 'COMPLETED' && selectedTournament.results && (
            <GlassCard className="p-6 border-green-500/30">
               <div className="flex justify-between items-center mb-6">
                  <SectionHeader title="Match Results" subtitle="Automatic payouts distributed" />
                  <Badge variant="SUCCESS">COMPLETED</Badge>
               </div>
               
               <div className="space-y-4">
                  {selectedTournament.resultImage && (
                    <img src={selectedTournament.resultImage} className="w-full rounded-2xl border border-white/5 shadow-xl" alt="Match Result" />
                  )}

                  <div className="bg-white/5 rounded-[1.5rem] overflow-hidden border border-white/5">
                     <table className="w-full text-left text-[10px]">
                        <thead className="bg-white/5">
                           <tr className="text-gray-500 font-black uppercase tracking-widest leading-none">
                              <th className="p-4">Rank</th>
                              <th className="p-4">Player</th>
                              <th className="p-4 text-center">Kills</th>
                              <th className="p-4 text-right">Prize</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {selectedTournament.results.sort((a, b) => a.rank - b.rank).map((res, i) => (
                             <tr key={i} className={res.userId === user?.id ? 'bg-blue-600/10' : ''}>
                                <td className="p-4 font-black italic text-white">
                                   {res.rank === 1 ? '🥇' : res.rank === 2 ? '🥈' : res.rank === 3 ? '🥉' : `#${res.rank}`}
                                </td>
                                <td className="p-4 text-white font-bold">{res.userName}</td>
                                <td className="p-4 text-gray-400 font-mono text-center">{res.kills}</td>
                                <td className="p-4 text-green-500 font-black italic text-right">৳{res.prize}</td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </GlassCard>
          )}

          {/* 1. Rules at the top - Redesigned */}
        <GlassCard className="p-2 border-white/5 bg-gradient-to-br from-blue-500/[0.03] to-transparent">
            <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-1">
               <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-blue-500/10 rounded-md flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg">
                    <Shield size={12} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-white italic tracking-tighter uppercase leading-none">Arena Protocol</h4>
                  </div>
               </div>
               {isAdminOrHigher && (
                  <button 
                    onClick={() => setIsEditingRules(!isEditingRules)}
                    className="p-1 bg-blue-500/10 rounded-md text-blue-500"
                  >
                     {isEditingRules ? <X size={12} /> : <Plus size={12} />}
                  </button>
               )}
            </div>
            
            <div className={`grid ${selectedTournament.rules.filter(r => r.trim()).length > 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-x-1 gap-y-0.5 max-h-24 overflow-y-auto pr-0.5 scrollbar-hide`}>
                {selectedTournament.rules.filter(r => r.trim()).length > 0 ? selectedTournament.rules.filter(r => r.trim()).map((rule, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.01 }}
                      key={idx} 
                      className="flex items-start gap-1 py-0.5 rounded-md bg-white/[0.01] hover:bg-white/[0.03] group transition-colors"
                    >
                        <div className="w-3 h-3 shrink-0 bg-blue-600/20 rounded-sm flex items-center justify-center text-[6px] font-black text-blue-400">
                           {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[7px] text-gray-400 font-medium leading-none uppercase italic group-hover:text-blue-200 transition-colors truncate">{rule}</p>
                        </div>
                        {isEditingRules && (
                           <button onClick={() => removeRule(idx)} className="text-red-500 p-0 hover:bg-red-500/10 rounded-md">
                              <X size={8} />
                           </button>
                        )}
                    </motion.div>
                )) : (
                  <div className="py-4 bg-white/[0.01] rounded-xl border border-dashed border-white/5 flex flex-col items-center justify-center text-center">
                     <p className="text-[7px] text-gray-700 font-black uppercase tracking-widest italic">No rules specified</p>
                  </div>
                )}
            </div>

            {isEditingRules && (
               <div className="mt-8 flex gap-3">
                  <input 
                    type="text"
                    value={newRule}
                    onChange={e => setNewRule(e.target.value)}
                    placeholder="Enter new rule..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white focus:outline-none focus:border-blue-500/50"
                  />
                  <button onClick={addRule} className="bg-blue-600 text-white px-5 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                     <Plus size={24} />
                  </button>
               </div>
            )}
        </GlassCard>

        {/* 2. Registration Status & Room Notice (For joined users) */}
        {userParticipation && (
          <GlassCard className="p-5 border-blue-500/30 bg-blue-600/[0.05]">
             <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                   <Lock size={24} />
                </div>
                <div className="flex-1">
                   <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none mb-1">Room Credentials</h3>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest leading-none">Slot #0{userParticipation.slot} Registered</p>
                   </div>
                </div>
             </div>
             
             {selectedTournament.roomId && selectedTournament.password ? (
                <div className="mt-4 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Room ID</p>
                      <p className="text-sm font-black text-white font-mono tracking-widest">{selectedTournament.roomId}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-right">
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Password</p>
                      <p className="text-sm font-black text-white font-mono tracking-widest">{selectedTournament.password}</p>
                   </div>
                </div>
             ) : (
                <div className="mt-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                   <p className="text-[10px] text-gray-400 font-medium italic leading-relaxed">
                      "Room ID & Password will be provided <span className="text-blue-500 font-bold">5-10 minutes</span> before the match starts. You will receive a notification when it's ready."
                   </p>
                </div>
             )}
          </GlassCard>
        )}

        {/* 3. Main Stats */}
        <GlassCard className="p-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Prize Pool</p>
                    <div className="flex justify-center items-center gap-1 text-blue-500">
                        <Trophy size={14} />
                        <span className="text-lg font-black italic tracking-tighter">৳{selectedTournament.prizePool}</span>
                    </div>
                </div>
                <div className="text-center border-x border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Per Kill</p>
                    <div className="flex justify-center items-center gap-1 text-white">
                        <Zap size={14} className="text-yellow-500" />
                        <span className="text-lg font-black italic tracking-tighter">৳{selectedTournament.perKill}</span>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Entry Fee</p>
                    <div className="flex justify-center items-center gap-1 text-white">
                        <DollarSign size={14} className="text-green-500" />
                        <span className="text-lg font-black italic tracking-tighter">৳{selectedTournament.entryFee}</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
               <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Top Prizes</p>
                  <div className="flex gap-2">
                     {selectedTournament.prizes.slice(0, 3).map((p, i) => (
                        <div key={i} className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                           <span className="text-[9px] font-black text-white italic">৳{p.prize}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <button 
                 onClick={() => setShowPrizeModal(true)}
                 className="h-10 px-6 bg-blue-600/10 border border-blue-500/30 rounded-xl text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 flex items-center gap-2"
               >
                  <Trophy size={14} />
                  Prize Pool
               </button>
            </div>

            {/* Prize Pool Modal */}
            <AnimatePresence>
               {showPrizeModal && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPrizeModal(false)}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md"
                     />
                     <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-[#121214] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
                     >
                        <div className="p-8">
                           <div className="flex justify-between items-center mb-8">
                              <div>
                                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Prize Pool</h3>
                                 <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Full Distribution Details</p>
                              </div>
                              <button onClick={() => setShowPrizeModal(false)} className="p-2 bg-white/5 rounded-xl text-gray-500">
                                 <X size={20} />
                              </button>
                           </div>

                           <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                              {selectedTournament.prizes.map((p, i) => (
                                 <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                                          i === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                          i === 1 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/30' :
                                          i === 2 ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                                          'bg-white/5 text-gray-500 border border-white/5'
                                       }`}>
                                          {i + 1}
                                       </div>
                                       <span className="text-xs font-black text-white uppercase italic tracking-wider">{p.position}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                       <span className="text-gray-500 text-[10px] font-bold">৳</span>
                                       <span className="text-lg font-black text-green-500 italic tracking-tighter group-hover:scale-110 transition-transform">{p.prize}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>

                           <div className="mt-8 pt-6 border-t border-white/5">
                              <div className="flex justify-between items-center px-2">
                                 <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Total Pool</span>
                                 <span className="text-xl font-black text-white italic tracking-tighter">৳{selectedTournament.prizePool}</span>
                              </div>
                              <p className="text-[8px] text-gray-600 font-bold uppercase text-center mt-6 tracking-[0.2em] opacity-50">Tunex Gaming Official</p>
                           </div>
                        </div>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>
        </GlassCard>

        {/* 4. Match Info Details */}
        <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 shadow-inner">
                    <Map size={18} />
                </div>
                <div>
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Map</p>
                    <p className="text-xs font-black text-white uppercase italic tracking-tighter">{selectedTournament.map}</p>
                </div>
            </GlassCard>
            <GlassCard className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 shadow-inner">
                    <Users size={18} />
                </div>
                <div>
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Type</p>
                    <p className="text-xs font-black text-white uppercase italic tracking-tighter">{selectedTournament.type}</p>
                </div>
            </GlassCard>
        </div>

        {/* 5. Participants List (Design from sample image) */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white italic tracking-tighter uppercase px-1">Participants</h3>
                  <div className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/20 rounded text-[8px] font-black text-blue-500 animate-pulse">LIVE</div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{participations.filter(p => p.tournamentId === selectedTournament.id).length}/{selectedTournament.totalSlots}</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-500/50 border border-white/5">
                     <Users size={14} />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               {/* Show actual participants */}
               {participations
                 .filter(p => p.tournamentId === selectedTournament.id)
                 .sort((a, b) => a.slot - b.slot)
                 .map((p) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={p.id} 
                    className={`flex items-center gap-4 p-3 rounded-xl border ${p.userId === user?.id ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-[#161618] border-white/5'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${p.userId === user?.id ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-[10px] font-black">{p.slot}</span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white uppercase italic tracking-wider truncate">{p.gameName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Player ID: {p.userId.slice(0, 8)}...</span>
                           {p.teammates && p.teammates.length > 0 && (
                              <span className="text-[7px] bg-white/5 text-gray-500 px-1.5 py-0.5 rounded border border-white/5 font-black uppercase">+{p.teammates.length} Teammates</span>
                           )}
                        </div>
                     </div>
                     {p.userId === user?.id && (
                        <div className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20">
                           <span className="text-[8px] font-black uppercase tracking-widest">YOU</span>
                        </div>
                     )}
                  </motion.div>
               ))}

               {/* Show initial empty slots if few participants */}
               {participations.filter(p => p.tournamentId === selectedTournament.id).length < 5 && Array.from({ length: Math.max(0, 3 - participations.filter(p => p.tournamentId === selectedTournament.id).length) }).map((_, idx) => {
                  const currentCount = participations.filter(p => p.tournamentId === selectedTournament.id).length;
                  return (
                    <div key={`empty-${idx}`} className="flex items-center gap-4 bg-white/[0.02] border border-dashed border-white/5 p-3 rounded-xl opacity-30">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <span className="text-[10px] font-black text-gray-600">{currentCount + idx + 1}</span>
                       </div>
                       <p className="text-[10px] font-black text-gray-700 uppercase italic tracking-widest">Available Slot</p>
                    </div>
                  );
               })}

               {selectedTournament.joinedSlots < selectedTournament.totalSlots && (
                  <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                     <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] italic mb-1">More slots waiting to be filled</p>
                     <p className="text-[7px] text-gray-800 font-bold uppercase tracking-widest">Tunex Gaming Official Match</p>
                  </div>
               )}
            </div>
        </div>

        <div className="h-4"></div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent pb-12 z-40">
          <div className="max-w-md mx-auto flex items-center gap-4">
              <div className="flex-1">
                 <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 px-1">Slots Joined</p>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedTournament.joinedSlots/selectedTournament.totalSlots)*100}%` }}
                        className="h-full bg-blue-600"
                    />
                 </div>
                 <p className="text-[10px] text-white font-black mt-1 px-1 tracking-widest">{selectedTournament.joinedSlots}/{selectedTournament.totalSlots} JOINED</p>
              </div>
              
              {userParticipation ? (
                <div className="h-14 bg-green-500/10 rounded-xl border border-green-500/20 px-8 flex items-center justify-center gap-3">
                   <Shield size={18} className="text-green-400" />
                   <span className="text-[10px] font-black text-green-400 uppercase italic tracking-widest">JOINED</span>
                </div>
              ) : (
                <GradientButton 
                  onClick={openJoinModal}
                  variant={isFull ? 'ghost' : 'success'} 
                  className="px-10 h-14"
                  disabled={isFull}
                >
                  {isFull ? 'FULL' : 'JOIN MATCH'}
                </GradientButton>
              )}
          </div>
      </div>

      {/* Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowJoinModal(false)}
               className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
             />
             <motion.div 
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 100, opacity: 0 }}
               className="relative w-full max-w-sm bg-[#121214] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl"
             >
                <div className="p-8">
                   <AnimatePresence mode="wait">
                      {isJoinedSuccessfully ? (
                         <motion.div 
                           key="success"
                           initial={{ scale: 0.8, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           className="text-center py-8"
                         >
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                               <Shield size={40} className="text-white" />
                            </div>
                            
                             <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Registration Successful!</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8 px-4">
                               You have been successfully registered for {selectedTournament.title}. Your slot details are now visible on the match page.
                            </p>
                            <GradientButton 
                               onClick={() => setShowJoinModal(false)}
                               fullWidth
                            >
                               DONE
                            </GradientButton>
                         </motion.div>
                      ) : (
                         <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Joining Confirmation</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-8">Enter your details to register</p>

                            <form onSubmit={handleJoinSubmit} className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest px-1">Game Name/PID</label>
                                  <div className="relative">
                                     <User className="absolute left-4 top-4 text-gray-600" size={18} />
                                     <input 
                                       required
                                       autoFocus
                                       value={gameName}
                                       onChange={e => setGameName(e.target.value)}
                                       placeholder="Your In-Game Name"
                                       className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold text-xs"
                                     />
                                  </div>
                               </div>

                               {(selectedTournament.type === 'DUO' || selectedTournament.type === 'SQUAD') && (
                                 <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                       <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Teammates Details</label>
                                       <button 
                                         type="button"
                                         onClick={handleAddTeammate}
                                         className="text-[9px] text-blue-500 font-black uppercase tracking-widest"
                                       >
                                         {((selectedTournament.type === 'DUO' && teammates.length < 1) || (selectedTournament.type === 'SQUAD' && teammates.length < 3)) && "+ Add Teammate"}
                                       </button>
                                    </div>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                       {teammates.map((tm, idx) => (
                                         <div key={idx} className="relative group">
                                            <input 
                                              required
                                              value={tm}
                                              onChange={e => updateTeammate(idx, e.target.value)}
                                              placeholder={`Teammate #${idx + 1} Name`}
                                              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/30 font-bold text-[10px]"
                                            />
                                            <button 
                                              type="button" 
                                              onClick={() => setTeammates(teammates.filter((_, i) => i !== idx))}
                                              className="absolute right-3 top-3 text-red-500/50 group-hover:text-red-500"
                                            >
                                               <X size={14} />
                                            </button>
                                         </div>
                                       ))}
                                       {teammates.length === 0 && (
                                         <div className="p-4 border-2 border-dashed border-white/5 rounded-2xl text-center">
                                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">No teammates added yet</p>
                                         </div>
                                       )}
                                    </div>
                                 </div>
                               )}

                               {error && (
                                 <p className="text-[10px] text-red-500 font-bold text-center italic">! {error}</p>
                               )}

                               <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl mb-4">
                                  <input 
                                    type="checkbox" 
                                    className="mt-1"
                                    checked={agreedToRules}
                                    onChange={e => setAgreedToRules(e.target.checked)}
                                   />
                                  <p className="text-[9px] text-red-500 font-bold uppercase leading-tight">I DECLARE I WON'T HACK. Banning for cheating is permanent.</p>
                               </div>

                               <div className="pt-2">
                                  <div className="flex justify-between items-center mb-4 px-2">
                                     <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Entry Fee</span>
                                     <span className="text-sm font-black text-white italic">৳{selectedTournament.entryFee}</span>
                                  </div>
                                  <GradientButton 
                                     type="submit" 
                                     fullWidth 
                                     disabled={isJoining}
                                     className="h-14 font-black tracking-widest italic"
                                  >
                                     {isJoining ? 'Processing...' : 'CONFIRM TO JOIN'}
                                  </GradientButton>
                               </div>
                            </form>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchDetails;
