import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentConfig } from '../data/mockData';
import { Plus, Users, Trophy, DollarSign, Edit, Trash2, LayoutDashboard, PlusCircle, ArrowLeft, Zap, Shield, Check, X, Gamepad2, LayoutGrid } from 'lucide-react';
import { GlassCard, GradientButton, Badge } from '../components/SharedUI';
import { motion, AnimatePresence } from 'motion/react';

const Admin: React.FC = () => {
  const { 
    tournaments, setPage, user, homeConfig, updateHomeConfig, 
    addTournament, updateTournament, deleteTournament, setNotifications,
    addNotification, participations,
    transactions, updateTransactionStatus, paymentConfig, updatePaymentConfig,
    updateMatchStatus, addCategory, deleteCategory, addMode, deleteMode,
    distributePrizes, toggleUserBan, updateUserRole, users, updateUser, updateAutoMatchConfig
  } = useApp();

  const isAdminOrHigher = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'SUB_ADMIN';

  if (!isAdminOrHigher) {
    setPage('home');
    return null;
  }
  
  const [activeTab, setActiveTab] = useState<'MATCHES' | 'USERS' | 'FINANCE' | 'ASSETS' | 'SYSTEM'>('MATCHES');
  const [searchTerm, setSearchTerm] = useState('');
  const [tourneyFilter, setTourneyFilter] = useState<'ALL' | 'UPCOMING' | 'LIVE' | 'COMPLETED'>('ALL');
  const [showParticipantsList, setShowParticipantsList] = useState<string | null>(null);
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteRole, setPromoteRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'SUB_ADMIN'>('ADMIN');
  const [editingBanner, setEditingBanner] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingMode, setEditingMode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showModeForm, setShowModeForm] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState<string | null>(null);
  const [showPayoutForm, setShowPayoutForm] = useState<string | null>(null);
  const [editingPayment, setEditingPayment] = useState(false);
  const [tempPayConfig, setTempPayConfig] = useState<PaymentConfig>(paymentConfig);
  const [payoutData, setPayoutData] = useState<{
    resultImage: string;
    results: { userId: string, userName: string, kills: number, rank: number, prize: number }[];
  }>({
    resultImage: '',
    results: [{ userId: 'u1', userName: user?.name || 'Player', kills: 0, rank: 1, prize: 0 }]
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    game: 'Free Fire',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop'
  });

  const [modeForm, setModeForm] = useState({
    name: '',
    parentId: '',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop'
  });

  // Form State for editing/adding
  const [matchForm, setMatchForm] = useState({
    title: '',
    game: 'Free Fire',
    category: 'BR Match',
    type: 'SOLO' as const,
    map: 'Bermuda',
    prizePool: 0,
    entryFee: 0,
    perKill: 0,
    prizes: [{ position: '1st', prize: 0 }, { position: '2nd', prize: 0 }, { position: '3rd', prize: 0 }],
    startTime: '',
    totalSlots: 48,
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    roomId: '',
    password: '',
    rules: ['No Hack allowed', 'Room ID shared 15m before match']
  });

  const [systemForm, setSystemForm] = useState({
    appName: homeConfig.appName,
    apkLink: homeConfig.apkLink || '',
    appLogo: homeConfig.appLogo,
    tickerAnnouncement: homeConfig.tickerAnnouncement,
    maintenanceMode: homeConfig.maintenanceMode,
    telegramLink: homeConfig.telegramLink,
    telegramGroupLink: homeConfig.telegramGroupLink,
    youtubeLink: homeConfig.youtubeLink || ''
  });

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const stats = [
    { label: 'Active Matches', value: tournaments.filter(t => t.status !== 'COMPLETED').length, icon: <Zap size={20} className="text-yellow-500" /> },
    { label: 'Total Users', value: users.length, icon: <Users size={20} className="text-blue-500" /> },
    { label: 'Revenue', value: `৳ ${users.reduce((acc, curr) => acc + (curr.earnings || 0), 0)}`, icon: <DollarSign size={20} className="text-green-500" /> },
  ];

  return (
    <div className="pb-24 px-4 pt-4 min-h-screen bg-[#0A0A0B]">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 px-1">
        <div className="flex items-center gap-4">
           <button onClick={() => setPage('profile')} className="p-3 bg-white/5 rounded-2xl text-white border border-white/5 active:scale-90">
              <ArrowLeft size={20} />
           </button>
           <div className="flex items-center gap-3">
             {homeConfig.appLogo && (
                <img src={homeConfig.appLogo} alt={homeConfig.appName} className="w-10 h-10 object-contain" />
             )}
             <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Admin<br /><span className="text-blue-500">Control</span></h2>
           </div>
        </div>
        <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
           <LayoutDashboard size={24} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="p-4 text-center">
             <div className="flex justify-center mb-2">{stat.icon}</div>
             <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">{stat.label}</p>
             <p className="text-lg font-black text-white italic tracking-tighter">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl mb-8 border border-white/5 overflow-x-auto scrollbar-hide">
         {[
           {id: 'MATCHES', label: 'MATCHES', icon: <Trophy size={14} />},
           {id: 'USERS', label: 'USERS', icon: <Users size={14} />},
           {id: 'FINANCE', label: 'FINANCE', icon: <DollarSign size={14} />},
           {id: 'ASSETS', label: 'ASSETS', icon: <Plus size={14} />},
           {id: 'SYSTEM', label: 'SYSTEM', icon: <Shield size={14} />}
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-500 hover:text-gray-300'}`}
           >
             {tab.icon}
             {tab.label}
           </button>
         ))}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {activeTab === 'MATCHES' ? (
          <>
            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Live Tournaments</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">Manage active listings</p>
              </div>
              <GradientButton 
                onClick={() => {
                  setEditingTournamentId(null);
                  setMatchForm({
                    title: '', game: 'Free Fire', category: 'BR Match', type: 'SOLO',
                    map: 'Bermuda', prizePool: 0, entryFee: 0, perKill: 0,
                    prizes: [{ position: '1st', prize: 0 }, { position: '2nd', prize: 0 }, { position: '3rd', prize: 0 }],
                    startTime: new Date().toISOString().slice(0, 16),
                    totalSlots: 48, banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
                    roomId: '', password: '',
                    rules: homeConfig.defaultTournamentRules || []
                  });
                  setShowAddForm(!showAddForm);
                }}
                className="h-10 px-4 rounded-xl flex items-center gap-2"
              >
                 {showAddForm ? <ArrowLeft size={16} /> : <PlusCircle size={16} />}
                 <span className="text-[10px]">{showAddForm ? 'Back' : 'New Match'}</span>
              </GradientButton>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <GlassCard className="p-6 border-blue-500/30 bg-blue-500/[0.03] space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Game</label>
                         <select 
                           className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none appearance-none"
                           value={matchForm.game}
                           onChange={e => setMatchForm({...matchForm, game: e.target.value})}
                         >
                           {homeConfig.categories.map(c => (
                             <option key={c.id} value={c.game} className="bg-[#0A0A0B]">{c.game}</option>
                           ))}
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Category (Mode)</label>
                         <select 
                           className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white appearance-none"
                           value={matchForm.category}
                           onChange={e => setMatchForm({...matchForm, category: e.target.value})}
                         >
                           <option value="" disabled className="bg-[#0A0A0B]">Select Mode</option>
                           {homeConfig.modes
                             .filter(m => homeConfig.categories.find(c => c.id === m.parentId)?.game === matchForm.game)
                             .map(mode => (
                               <option key={mode.id} value={mode.name} className="bg-[#0A0A0B]">{mode.name}</option>
                             ))
                           }
                         </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Match Title</label>
                      <input 
                        type="text" 
                        placeholder="BR MATCH || #101"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                        value={matchForm.title}
                        onChange={e => setMatchForm({...matchForm, title: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Type</label>
                        <select 
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                          value={matchForm.type}
                          onChange={e => setMatchForm({...matchForm, type: e.target.value as any})}
                        >
                          <option value="SOLO" className="bg-[#0A0A0B]">SOLO</option>
                          <option value="DUO" className="bg-[#0A0A0B]">DUO</option>
                          <option value="SQUAD" className="bg-[#0A0A0B]">SQUAD</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Start Time</label>
                        <input 
                          type="datetime-local" 
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                          value={matchForm.startTime}
                          onChange={e => setMatchForm({...matchForm, startTime: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest px-1">Tournament Banner (Upload or URL)</label>
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer">
                          <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                             <PlusCircle size={16} className="text-blue-500" />
                             <span className="text-[9px] font-black text-white uppercase tracking-widest">
                               {matchForm.banner.startsWith('data:') ? '✅ Uploaded' : 'Upload Image'}
                             </span>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setMatchForm({...matchForm, banner: reader.result as string});
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <input 
                          type="text" 
                          placeholder="OR PASTE URL HERE..."
                          className="flex-[2] bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none italic"
                          value={matchForm.banner.startsWith('data:') ? '' : matchForm.banner}
                          onChange={e => setMatchForm({...matchForm, banner: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[8px] text-blue-500 font-black uppercase tracking-widest">Room ID</label>
                          <input 
                            type="text" 
                            className="w-full bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                            value={matchForm.roomId}
                            onChange={e => setMatchForm({...matchForm, roomId: e.target.value})}
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] text-blue-500 font-black uppercase tracking-widest">Password</label>
                          <input 
                            type="text" 
                            className="w-full bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                            value={matchForm.password}
                            onChange={e => setMatchForm({...matchForm, password: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest leading-none">Prize Distribution</label>
                        <button 
                          onClick={() => setMatchForm({...matchForm, prizes: [...matchForm.prizes, { position: '', prize: 0 }]})}
                          className="text-[9px] text-blue-500 font-black uppercase tracking-widest flex items-center gap-1"
                        >
                          <Plus size={10} /> Add Tier
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                        {matchForm.prizes.map((p, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input 
                              placeholder="Position (e.g. 1st)"
                              className="flex-1 bg-white/5 border border-white/5 rounded-xl p-2.5 text-[10px] text-white"
                              value={p.position}
                              onChange={e => {
                                const newPrizes = [...matchForm.prizes];
                                newPrizes[idx].position = e.target.value;
                                setMatchForm({...matchForm, prizes: newPrizes});
                              }}
                            />
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[10px]">৳</span>
                              <input 
                                type="number"
                                placeholder="Amount"
                                className="w-full bg-white/5 border border-white/5 rounded-xl p-2.5 pl-6 text-[10px] text-white"
                                value={p.prize}
                                onChange={e => {
                                  const newPrizes = [...matchForm.prizes];
                                  newPrizes[idx].prize = Number(e.target.value);
                                  setMatchForm({...matchForm, prizes: newPrizes});
                                }}
                              />
                            </div>
                            {matchForm.prizes.length > 1 && (
                              <button 
                                onClick={() => setMatchForm({...matchForm, prizes: matchForm.prizes.filter((_, i) => i !== idx)})}
                                className="p-2 text-red-500/50 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                       <div>
                          <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Prize Pool</label>
                          <input type="number" className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white" value={matchForm.prizePool} onChange={e => setMatchForm({...matchForm, prizePool: Number(e.target.value)})} />
                       </div>
                       <div>
                          <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Entry Fee</label>
                          <input type="number" className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white" value={matchForm.entryFee} onChange={e => setMatchForm({...matchForm, entryFee: Number(e.target.value)})} />
                       </div>
                       <div>
                          <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Per Kill</label>
                          <input type="number" className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white" value={matchForm.perKill} onChange={e => setMatchForm({...matchForm, perKill: Number(e.target.value)})} />
                       </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Match Rules (Line by Line) <span className="text-blue-500 ml-2">(Auto-saves as default)</span></label>
                      <textarea 
                        className="w-full h-24 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none resize-none font-medium"
                        value={(matchForm.rules || []).join('\n')}
                        onChange={e => setMatchForm({...matchForm, rules: e.target.value.split('\n')})}
                        placeholder="ENTER RULES HERE..."
                      />
                    </div>

                    <GradientButton 
                      fullWidth 
                      className="h-12"
                      onClick={() => {
                        const { roomId, password, ...rest } = matchForm;
                        if (editingTournamentId) {
                          updateTournament(editingTournamentId, { ...rest, roomId, password, rules: matchForm.rules });
                          
                          // Auto-save rules as default for next time
                          if (matchForm.rules.length > 0) {
                            updateHomeConfig({ ...homeConfig, defaultTournamentRules: matchForm.rules });
                          }
                          
                          // If credentials were added, notify users
                          if (roomId && password) {
                             const newNotif = {
                               id: Math.random().toString(),
                               title: 'Room Access Ready!',
                               message: `Room ID and Pass are live for ${matchForm.title}. Check Match Details.`,
                               time: 'Just now',
                               type: 'SUCCESS' as const,
                               read: false
                             };
                             setNotifications(prev => [newNotif, ...prev]);
                          }
                        } else {
                          const matchId = Math.floor(100000 + Math.random() * 900000).toString();
                          addTournament({
                            ...rest,
                            id: matchId,
                            title: matchForm.title || `${matchForm.category} || Match No.${matchId}`,
                            roomId,
                            password,
                            joinedSlots: 0,
                            status: 'UPCOMING',
                            rules: matchForm.rules.length > 0 ? matchForm.rules : (homeConfig.defaultTournamentRules || []),
                            version: 'Mobile'
                          });

                          // Auto-save rules as default for next matches
                          if (matchForm.rules.length > 0) {
                            updateHomeConfig({ ...homeConfig, defaultTournamentRules: matchForm.rules });
                          }

                          addNotification({
                            title: 'Match Published',
                            message: `${matchForm.title} is now live.`,
                            type: 'SUCCESS'
                          });
                        }
                        setShowAddForm(false);
                      }}
                    >
                      <span className="text-[10px]">{editingTournamentId ? 'Update Match' : 'Publish Match'}</span>
                    </GradientButton>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide py-1">
               {(['ALL', 'UPCOMING', 'LIVE', 'COMPLETED'] as const).map(f => (
                 <button
                    key={f}
                    onClick={() => setTourneyFilter(f)}
                    className={`px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tourneyFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-gray-500 border border-white/5'}`}
                 >
                    {f}
                 </button>
               ))}
            </div>

              <div className="space-y-4">
                 {tournaments
                   .filter(t => tourneyFilter === 'ALL' ? true : t.status === tourneyFilter)
                   .map(t => (
                   <GlassCard key={t.id} className="p-0 overflow-hidden border-white/10 hover:border-blue-500/30 transition-all group relative">
                      <div className="p-4 flex gap-4">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 bg-black flex items-center justify-center shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-500 relative">
                             {t.banner && t.banner.length > 0 ? (
                               <img src={t.banner} alt={t.title} className="w-full h-full object-cover" />
                             ) : (
                               <Gamepad2 size={32} className="text-white/10" />
                             )}
                             <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[6px] font-black text-white border border-white/10">#{t.id}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h4 className="text-sm font-black text-white italic tracking-tighter uppercase truncate pr-4">{t.title}</h4>
                                   <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                        t.status === 'LIVE' ? 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse' : 
                                        t.status === 'COMPLETED' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
                                        'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                      }`}>
                                        {t.status}
                                      </span>
                                      <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">{t.game}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-y-2 mt-4">
                                <div className="flex items-center gap-2">
                                   <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                      <Users size={10} className="text-gray-500" />
                                   </div>
                                   <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest">{t.joinedSlots}/{t.totalSlots}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                      <DollarSign size={10} className="text-gray-500" />
                                   </div>
                                   <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest">৳{t.entryFee}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                      <Trophy size={10} className="text-gray-500" />
                                   </div>
                                   <span className="text-[9px] font-black text-yellow-500 uppercase italic tracking-widest">৳{t.prizePool}</span>
                                </div>
                                <button 
                                  onClick={() => setShowParticipantsList(showParticipantsList === t.id ? null : t.id)}
                                  className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${showParticipantsList === t.id ? 'text-blue-400' : 'text-blue-500/60 hover:text-blue-500'}`}
                                >
                                   <Users size={12} /> {showParticipantsList === t.id ? 'Hide Players' : 'View Players'}
                                </button>
                             </div>
                          </div>
                          <div className="flex flex-col gap-2">
                             <button 
                               onClick={() => {
                                 setEditingTournamentId(t.id);
                                 setMatchForm({
                                   ...t,
                                   startTime: t.startTime.slice(0, 16),
                                   roomId: t.roomId || '',
                                   password: t.password || '',
                                   rules: t.rules || []
                                 });
                                 setShowAddForm(true);
                               }}
                               className="p-2.5 bg-blue-600/10 rounded-2xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-90 border border-blue-500/20"
                             >
                                <Edit size={16} />
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 if (window.confirm("Are you sure you want to delete this match permanently?")) {
                                   deleteTournament(t.id);
                                 }
                               }}
                               className="p-2.5 bg-red-600/10 rounded-2xl text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-90 border border-red-500/20"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                      </div>

                      <AnimatePresence>
                         {showParticipantsList === t.id && (
                           <motion.div 
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             className="overflow-hidden bg-black/40 border-t border-white/5"
                           >
                              <div className="p-4 space-y-2 max-h-60 overflow-y-auto scrollbar-hide bg-gradient-to-b from-blue-500/[0.02] to-transparent">
                                 <div className="flex justify-between items-center mb-3 px-1">
                                    <div className="flex items-center gap-2">
                                       <Users size={12} className="text-blue-500" />
                                       <span className="text-[10px] text-white font-black uppercase tracking-widest italic">Registered Players</span>
                                    </div>
                                    <Badge variant="secondary">{participations.filter(p => p.tournamentId === t.id).length} Joined</Badge>
                                 </div>
                                 {participations.filter(p => p.tournamentId === t.id).length > 0 ? (
                                   <div className="grid grid-cols-1 gap-2">
                                      {participations.filter(p => p.tournamentId === t.id).map((p) => (
                                         <div key={p.id} className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                                            <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/10 shrink-0">
                                               <span className="text-[10px] font-black text-blue-500">{p.slot}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                               <p className="text-[11px] font-black text-white uppercase italic tracking-widest truncate">{p.gameName}</p>
                                               <p className="text-[8px] text-gray-600 font-bold uppercase truncate tracking-tight">{p.userId}</p>
                                            </div>
                                            <div className="text-right">
                                               <p className="text-[8px] text-gray-500 font-black uppercase">Team</p>
                                               <p className="text-[10px] font-black text-gray-300 uppercase italic">{(p.teammates || []).length + 1}P</p>
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                 ) : (
                                   <div className="py-10 text-center bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5">
                                      <Users size={32} className="mx-auto mb-3 text-gray-800" />
                                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic">No participants registered yet</p>
                                   </div>
                                 )}
                              </div>
                           </motion.div>
                         )}
                      </AnimatePresence>

                      <div className="p-2 bg-white/[0.03] border-t border-white/5 flex gap-2">
                         {(['UPCOMING', 'LIVE', 'COMPLETED'] as const).map(status => (
                           <button
                             key={status}
                             onClick={() => updateMatchStatus(t.id, status)}
                             className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                               t.status === status 
                                 ? 'bg-blue-600 border-blue-500 text-white shadow-xl scale-105 z-10' 
                                 : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-400 hover:bg-white/10'
                             }`}
                           >
                              {status}
                           </button>
                         ))}
                      </div>

                      {t.status === 'COMPLETED' && !t.results && (
                        <div className="p-3 bg-blue-500/10 border-t border-blue-500/20 space-y-3">
                          <button 
                            onClick={() => {
                              setPayoutData({
                                resultImage: '',
                                results: [{ userId: 'u1', userName: '', kills: 0, rank: 1, prize: 0 }]
                              });
                              setShowPayoutForm(t.id);
                            }}
                            className="w-full h-10 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                          >
                            Update Results & Pay Winners
                          </button>
                        </div>
                      )}

                      <div className="p-3 bg-black/40 border-t border-white/5 grid grid-cols-2 gap-3">
                         <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/5 focus-within:border-blue-500/30 transition-colors">
                            <p className="text-[7px] text-gray-500 font-black uppercase mb-1">Room ID</p>
                            <input 
                              className="bg-transparent border-none text-xs font-black text-blue-400 p-0 focus:ring-0 focus:outline-none w-full placeholder:text-gray-800"
                               defaultValue={t.roomId}
                               placeholder="Not Set"
                               onBlur={(e) => updateTournament(t.id, { roomId: e.target.value })}
                            />
                         </div>
                         <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/5 focus-within:border-blue-500/30 transition-colors">
                            <p className="text-[7px] text-gray-500 font-black uppercase mb-1">Password</p>
                            <input 
                              className="bg-transparent border-none text-xs font-black text-blue-400 p-0 focus:ring-0 focus:outline-none w-full placeholder:text-gray-800"
                               defaultValue={t.password}
                               placeholder="Not Set"
                               onBlur={(e) => updateTournament(t.id, { password: e.target.value })}
                            />
                         </div>
                      </div>
                   </GlassCard>
                ))}
              </div>
            </>
        ) : activeTab === 'USERS' ? (
          <div className="space-y-6">
             <div className="flex justify-between items-center px-1">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Command: <span className="text-blue-500">Users</span></h3>
                <Badge variant="INFO">{users.length} PLAYERS</Badge>
             </div>

             <GlassCard className="p-4 bg-white/[0.02]">
                <div className="relative group">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-all">
                      <Users size={18} />
                   </div>
                   <input 
                     type="text" 
                     placeholder="Search agents by name, email or ID..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-gray-700 italic"
                   />
                </div>
             </GlassCard>

             <div className="space-y-3">
                {users.filter(u => 
                  u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.id.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((u) => (
                  <GlassCard key={u.id} className="p-0 overflow-hidden border-white/5 hover:border-white/10 transition-colors group">
                     <div className="p-4 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 relative group-hover:scale-105 transition-transform duration-500">
                           {u.avatar ? (
                             <img src={u.avatar} alt="u" className="w-full h-full object-cover rounded-2xl" />
                           ) : (
                             <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 w-full h-full flex items-center justify-center rounded-2xl">
                               <Users size={24} className="text-white/10" />
                             </div>
                           )}
                           <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0A0B] ${u.isBanned ? 'bg-red-500' : 'bg-green-500'} shadow-lg`} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white italic tracking-tighter uppercase truncate">{u.name}</h4>
                              <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md border ${
                                u.role === 'SUPER_ADMIN' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                                u.role === 'ADMIN' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                                'bg-gray-500/10 border-gray-500/20 text-gray-500'
                              }`}>
                                 {u.role}
                              </span>
                           </div>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 truncate opacity-60">{u.email}</p>
                           <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5">
                                 <DollarSign size={10} className="text-green-500" />
                                 <span className="text-[10px] font-black text-white italic tracking-tighter">৳{u.coins.toFixed(2)}</span>
                              </div>
                              <div className="w-1 h-1 bg-white/10 rounded-full" />
                              <div className="flex items-center gap-1.5">
                                 <Trophy size={10} className="text-yellow-500" />
                                 <span className="text-[10px] font-black text-white italic tracking-tighter">{u.matchesPlayed} Matches</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <button 
                             onClick={() => {
                               const adjustment = window.prompt(`Adjust balance for ${u.name}? (e.g., 100 for add, -100 for subtract)`);
                               if (adjustment && !isNaN(Number(adjustment))) {
                                 const newCoins = u.coins + Number(adjustment);
                                 updateUser(u.id, { coins: newCoins < 0 ? 0 : newCoins });
                                 addNotification({ 
                                   title: 'Success', 
                                   message: `Updated ${u.name}'s balance to ৳${(newCoins < 0 ? 0 : newCoins).toFixed(2)}`, 
                                   type: 'SUCCESS' 
                                 });
                               }
                             }}
                             className="w-10 h-10 bg-green-600/10 border border-green-500/20 rounded-xl text-green-500 hover:bg-green-600 hover:text-white transition-all shadow-lg active:scale-90 flex items-center justify-center"
                             title="Adjust Balance"
                           >
                              <DollarSign size={18} />
                           </button>
                           {u.id !== user?.id && (
                             <>
                               <button 
                                 onClick={() => {
                                   toggleUserBan(u.id);
                                   addNotification({
                                     title: u.isBanned ? 'Access Restored' : 'Access Revoked',
                                     message: `${u.name} status updated.`,
                                     type: u.isBanned ? 'SUCCESS' : 'WARNING'
                                   });
                                 }}
                                 className={`w-10 h-10 rounded-xl transition-all shadow-lg active:scale-90 flex items-center justify-center border border-white/5 ${
                                   u.isBanned ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                                 }`}
                                 title={u.isBanned ? 'Unban' : 'Ban'}
                               >
                                  <Shield size={18} />
                               </button>
                               {isSuperAdmin && (
                                 <div className="relative group/role">
                                    <button className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-90 flex items-center justify-center">
                                       <Plus size={18} />
                                    </button>
                                    <div className="absolute right-0 bottom-0 mr-12 hidden group-hover/role:block bg-[#1A1C1E] border border-white/10 rounded-2xl p-2 w-36 shadow-2xl z-50">
                                       <p className="px-3 py-2 text-[7px] text-gray-500 font-black uppercase tracking-widest border-b border-white/5 mb-1">Set Permission</p>
                                       {(['ADMIN', 'SUB_ADMIN', 'USER'] as const).map(role => (
                                          <button 
                                            key={role}
                                            onClick={() => {
                                               updateUserRole(u.id, role);
                                               addNotification({ title: 'Role Updated', message: `${u.name} is now ${role}`, type: 'INFO' });
                                            }}
                                            className="w-full text-left p-2.5 rounded-xl text-[9px] font-black uppercase text-gray-400 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between"
                                          >
                                             {role}
                                             {u.role === role && <Check size={10} className="text-blue-500" />}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                               )}
                             </>
                           )}
                        </div>
                     </div>
                  </GlassCard>
                ))}
             </div>

             {/* Admin Add Section for Super Admin */}
             {isSuperAdmin && (
                <GlassCard className="p-6 border-blue-500/20 bg-blue-500/[0.02]">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                         <Zap size={18} />
                      </div>
                      <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Security: <span className="text-blue-500">Admin Fleet</span></h3>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest pl-1">Target Account Email</label>
                         <input 
                            placeholder="Enter existing user email..."
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold italic"
                            value={promoteEmail}
                            onChange={e => setPromoteEmail(e.target.value)}
                         />
                      </div>
                      <div className="flex gap-3">
                         <select 
                            className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-[10px] text-white appearance-none font-black tracking-widest italic focus:outline-none focus:border-blue-500/50"
                            value={promoteRole}
                            onChange={e => setPromoteRole(e.target.value as any)}
                         >
                            <option value="ADMIN" className="bg-[#0A0A0B]">ADMIN ROLE</option>
                            <option value="SUB_ADMIN" className="bg-[#0A0A0B]">SUB ADMIN ROLE</option>
                            <option value="SUPER_ADMIN" className="bg-[#0A0A0B]">SUPER ADMIN ROLE</option>
                         </select>
                         <button 
                            className="px-8 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                            onClick={() => {
                              if (!promoteEmail) return;
                              const newAdminEmails = [...homeConfig.adminEmails, { email: promoteEmail, role: promoteRole }];
                              updateHomeConfig({ ...homeConfig, adminEmails: newAdminEmails });
                              setPromoteEmail('');
                              addNotification({
                                title: 'Promotion Success!',
                                message: `${promoteEmail} will be ${promoteRole} upon next login.`,
                                type: 'SUCCESS'
                              });
                            }}
                         >
                            AUTHORIZE
                         </button>
                      </div>
                   </div>
                </GlassCard>
             )}
          </div>
        ) : activeTab === 'FINANCE' ? (
          <div className="space-y-8">
            {/* Payment Numbers Management */}
            <GlassCard className="p-6 border-blue-500/30">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-white italic tracking-tighter uppercase px-1">Payment Config</h3>
                  <button 
                    onClick={() => {
                      if (editingPayment) {
                        updatePaymentConfig(tempPayConfig);
                      } else {
                        setTempPayConfig(paymentConfig);
                      }
                      setEditingPayment(!editingPayment);
                    }}
                    className="p-2 bg-white/5 rounded-lg text-blue-500"
                  >
                     {editingPayment ? <Check size={18} /> : <Edit size={18} />}
                  </button>
               </div>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">bKash Method Name</label>
                        <input 
                          disabled={!editingPayment}
                          className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white"
                          value={tempPayConfig.bkashLabel}
                          onChange={e => setTempPayConfig({...tempPayConfig, bkashLabel: e.target.value})}
                          placeholder="e.g. bKash Personal"
                        />
                     </div>
                     <div>
                        <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">bKash Number</label>
                        <div className="relative group/input">
                          <input 
                            disabled={!editingPayment}
                            className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white pr-10"
                            value={tempPayConfig.bkash}
                            onChange={e => setTempPayConfig({...tempPayConfig, bkash: e.target.value})}
                          />
                          {editingPayment && (
                            <button 
                              onClick={() => setTempPayConfig({...tempPayConfig, bkash: ''})}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-500/50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Nagad Method Name</label>
                        <input 
                          disabled={!editingPayment}
                          className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white"
                          value={tempPayConfig.nagadLabel}
                          onChange={e => setTempPayConfig({...tempPayConfig, nagadLabel: e.target.value})}
                          placeholder="e.g. Nagad Personal"
                        />
                     </div>
                     <div>
                        <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Nagad Number</label>
                        <div className="relative group/input">
                          <input 
                            disabled={!editingPayment}
                            className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white pr-10"
                            value={tempPayConfig.nagad}
                            onChange={e => setTempPayConfig({...tempPayConfig, nagad: e.target.value})}
                          />
                          {editingPayment && (
                            <button 
                              onClick={() => setTempPayConfig({...tempPayConfig, nagad: ''})}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-500/50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Rocket Method Name</label>
                        <input 
                          disabled={!editingPayment}
                          className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white"
                          value={tempPayConfig.rocketLabel}
                          onChange={e => setTempPayConfig({...tempPayConfig, rocketLabel: e.target.value})}
                          placeholder="e.g. Rocket Personal"
                        />
                     </div>
                     <div>
                        <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Rocket Number</label>
                        <div className="relative group/input">
                          <input 
                            disabled={!editingPayment}
                            className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white pr-10"
                            value={tempPayConfig.rocket}
                            onChange={e => setTempPayConfig({...tempPayConfig, rocket: e.target.value})}
                          />
                          {editingPayment && (
                            <button 
                              onClick={() => setTempPayConfig({...tempPayConfig, rocket: ''})}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-500/50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                     </div>
                  </div>

                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest italic">Method Logos (Upload or URL)</p>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">bKash Logo</label>
                              <div className="flex gap-2">
                                 <label className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 shrink-0">
                                    <PlusCircle size={14} className="text-blue-500" />
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*" 
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => setTempPayConfig({...tempPayConfig, bkashLogo: reader.result as string});
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                 </label>
                                 <input 
                                   disabled={!editingPayment}
                                   className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3 text-[9px] text-white font-mono"
                                   value={tempPayConfig.bkashLogo.startsWith('data:') ? '' : tempPayConfig.bkashLogo}
                                   onChange={e => setTempPayConfig({...tempPayConfig, bkashLogo: e.target.value})}
                                 />
                              </div>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Nagad Logo</label>
                              <div className="flex gap-2">
                                 <label className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 shrink-0">
                                    <PlusCircle size={14} className="text-blue-500" />
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*" 
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => setTempPayConfig({...tempPayConfig, nagadLogo: reader.result as string});
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                 </label>
                                 <input 
                                   disabled={!editingPayment}
                                   className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3 text-[9px] text-white font-mono"
                                   value={tempPayConfig.nagadLogo.startsWith('data:') ? '' : tempPayConfig.nagadLogo}
                                   onChange={e => setTempPayConfig({...tempPayConfig, nagadLogo: e.target.value})}
                                 />
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Rocket Logo</label>
                              <div className="flex gap-2">
                                 <label className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 shrink-0">
                                    <PlusCircle size={14} className="text-blue-500" />
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*" 
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => setTempPayConfig({...tempPayConfig, rocketLogo: reader.result as string});
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                 </label>
                                 <input 
                                   disabled={!editingPayment}
                                   className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3 text-[9px] text-white font-mono"
                                   value={tempPayConfig.rocketLogo.startsWith('data:') ? '' : tempPayConfig.rocketLogo}
                                   onChange={e => setTempPayConfig({...tempPayConfig, rocketLogo: e.target.value})}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="grid grid-cols-2 gap-2">
                        <div>
                           <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Deposit Min</label>
                           <input type="number" disabled={!editingPayment} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white" value={tempPayConfig.minDeposit} onChange={e => setTempPayConfig({...tempPayConfig, minDeposit: Number(e.target.value)})} />
                        </div>
                        <div>
                           <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Withdraw Min</label>
                           <input type="number" disabled={!editingPayment} className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white" value={tempPayConfig.minWithdraw} onChange={e => setTempPayConfig({...tempPayConfig, minWithdraw: Number(e.target.value)})} />
                        </div>
                     </div>
                  </div>
               </div>
            </GlassCard>

            {/* Pending Transactions */}
            <div>
               <div className="flex justify-between items-center px-1 mb-6">
                  <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Pending Requests</h3>
                  <Badge variant="WARNING" className="animate-pulse">{transactions.filter(t => t.status === 'PENDING').length} TO PROCESS</Badge>
               </div>
               <div className="space-y-4">
                  {transactions.filter(t => t.status === 'PENDING').length > 0 ? (
                    transactions.filter(t => t.status === 'PENDING').map(t => (
                      <GlassCard key={t.id} className="p-0 overflow-hidden border-orange-500/20 bg-orange-500/[0.02]">
                         <div className="p-5 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                                  t.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                               }`}>
                                  <DollarSign size={20} />
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <h4 className="text-sm font-black text-white italic tracking-tight">৳{t.amount}</h4>
                                     <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                                        t.type === 'DEPOSIT' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                                     }`}>{t.type}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wider">{t.method} • {t.senderNumber || t.receiverNumber}</p>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => {
                                   if (window.confirm('Approve this transaction?')) {
                                     updateTransactionStatus(t.id, 'COMPLETED');
                                     addNotification({ title: 'Success', message: 'Transaction Approved', type: 'SUCCESS' });
                                   }
                                 }}
                                 className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 active:scale-90 transition-transform"
                                >
                                  <Check size={18} />
                               </button>
                               <button 
                                 onClick={() => {
                                   if (window.confirm('Reject this transaction?')) {
                                     updateTransactionStatus(t.id, 'REJECTED');
                                     addNotification({ title: 'Rejected', message: 'Transaction Denied', type: 'WARNING' });
                                   }
                                 }}
                                 className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 active:scale-90 transition-transform"
                               >
                                  <X size={18} />
                               </button>
                            </div>
                         </div>
                         {t.transactionId && (
                            <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                               <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest leading-none">Transaction ID</p>
                               <p className="text-[9px] font-mono text-blue-400 font-bold tracking-widest">{t.transactionId}</p>
                            </div>
                         )}
                      </GlassCard>
                    ))
                  ) : (
                    <div className="py-16 bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/5 text-center">
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic opacity-50">All caught up!<br />No pending requests</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        ) : activeTab === 'ASSETS' ? (
          <div className="space-y-8">
            {/* Social Links */}
            <GlassCard className="p-6 border-blue-500/30 bg-blue-500/[0.02]">
              <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none mb-6">Social Config</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Telegram Link</label>
                    <input 
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-mono"
                      value={homeConfig.telegramLink}
                      onChange={e => updateHomeConfig({ ...homeConfig, telegramLink: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Youtube Link</label>
                    <input 
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-mono"
                      value={homeConfig.youtubeLink || ''}
                      onChange={e => updateHomeConfig({ ...homeConfig, youtubeLink: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Banner Management */}
            <div>
              <div className="flex justify-between items-center px-1 mb-6">
                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Home Banners</h3>
                <button 
                  onClick={() => updateHomeConfig({...homeConfig, banners: [...homeConfig.banners, { image: '', link: '' }]})}
                  className="p-2 bg-blue-600/20 text-blue-500 rounded-xl border border-blue-500/30"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {homeConfig.banners.map((banner, idx) => (
                  <GlassCard key={idx} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <label className="shrink-0 cursor-pointer group">
                          <div className="w-20 h-16 rounded-lg overflow-hidden border border-white/5 bg-black flex items-center justify-center relative">
                            {banner.image && banner.image.length > 0 ? (
                              <img src={banner.image} className="w-full h-full object-cover" />
                            ) : (
                              <Gamepad2 size={24} className="text-white/10" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <PlusCircle size={16} className="text-white" />
                            </div>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const newBanners = [...homeConfig.banners];
                                  newBanners[idx] = { ...banner, image: reader.result as string };
                                  updateHomeConfig({ ...homeConfig, banners: newBanners });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <div className="flex-1 space-y-2">
                          <input 
                            placeholder="Image URL (OR UPLOAD LEFT)"
                            value={banner.image.startsWith('data:') ? '' : banner.image}
                            onChange={(e) => {
                              const newBanners = [...homeConfig.banners];
                              newBanners[idx] = { ...banner, image: e.target.value };
                              updateHomeConfig({ ...homeConfig, banners: newBanners });
                            }}
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[9px] text-white focus:outline-none font-mono"
                          />
                          <input 
                            placeholder="Redirect Link (Optional)"
                            value={banner.link || ''}
                            onChange={(e) => {
                              const newBanners = [...homeConfig.banners];
                              newBanners[idx] = { ...banner, link: e.target.value };
                              updateHomeConfig({ ...homeConfig, banners: newBanners });
                            }}
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[9px] text-white focus:outline-none font-mono"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newBanners = homeConfig.banners.filter((_, i) => i !== idx);
                            updateHomeConfig({ ...homeConfig, banners: newBanners });
                          }}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Category Management */}
            <div>
              <div className="flex justify-between items-center px-1 mb-6">
                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Game Categories</h3>
                <button 
                  onClick={() => {
                    setCategoryForm({ name: '', game: 'Free Fire', image: '' });
                    setShowCategoryForm(!showCategoryForm);
                  }}
                  className="p-2 bg-blue-600/20 text-blue-500 rounded-xl border border-blue-500/30"
                >
                   {showCategoryForm ? <ArrowLeft size={16} /> : <Plus size={16} />}
                </button>
              </div>

              <AnimatePresence>
                {showCategoryForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <GlassCard className="p-6 border-blue-500/30 bg-blue-500/[0.03] space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                           <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Category Name</label>
                           <input 
                             placeholder="BR Match"
                             value={categoryForm.name}
                             onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                             className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white"
                           />
                         </div>
                         <div className="space-y-1">
                           <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Game Name</label>
                           <input 
                             placeholder="Free Fire"
                             value={categoryForm.game}
                             onChange={e => setCategoryForm({...categoryForm, game: e.target.value})}
                             className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white"
                           />
                         </div>
                       </div>
                       <div className="space-y-1">
                         <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Cover Image (Upload or URL)</label>
                         <div className="flex gap-2">
                            <label className="flex-1 cursor-pointer">
                               <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                                  <PlusCircle size={16} className="text-blue-500" />
                                  <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">
                                    {categoryForm.image.startsWith('data:') ? '✅ Done' : 'UPLOAD'}
                                  </span>
                               </div>
                               <input 
                                 type="file" 
                                 className="hidden" 
                                 accept="image/*" 
                                 onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                     const reader = new FileReader();
                                     reader.onloadend = () => setCategoryForm({...categoryForm, image: reader.result as string});
                                     reader.readAsDataURL(file);
                                   }
                                 }}
                               />
                            </label>
                            <input 
                              placeholder="OR PASTE URL..."
                              value={categoryForm.image.startsWith('data:') ? '' : categoryForm.image}
                              onChange={e => setCategoryForm({...categoryForm, image: e.target.value})}
                              className="flex-[2] bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-mono"
                            />
                         </div>
                       </div>
                       <GradientButton 
                         fullWidth 
                         className="h-12"
                         onClick={() => {
                            addCategory({
                              ...categoryForm,
                              id: Math.random().toString(36).substr(2, 9),
                              count: 0
                            });
                            setShowCategoryForm(false);
                         }}
                       >
                         <span className="text-[10px] font-black uppercase italic tracking-widest">Add Category</span>
                       </GradientButton>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {homeConfig.categories.map((cat) => (
                  <GlassCard key={cat.id} className="p-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 shrink-0 bg-black flex items-center justify-center">
                           {cat.image && cat.image.length > 0 ? (
                             <img src={cat.image} className="w-full h-full object-cover" />
                           ) : (
                             <Gamepad2 size={24} className="text-white/10" />
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-xs font-black text-white italic tracking-tighter uppercase mb-0.5">{cat.name}</h4>
                           <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest mb-1 italic">{cat.game}</p>
                           {editingCategory === cat.id ? (
                               <div className="flex gap-2 items-center">
                                  <label className="p-2 bg-blue-600/20 rounded-lg text-blue-500 border border-blue-500/30 cursor-pointer active:scale-95 transition-transform">
                                     <PlusCircle size={14} />
                                     <input 
                                       type="file" 
                                       className="hidden" 
                                       accept="image/*" 
                                       onChange={(e) => {
                                         const file = e.target.files?.[0];
                                         if (file) {
                                           const reader = new FileReader();
                                           reader.onloadend = () => {
                                             const newCats = homeConfig.categories.map(c => 
                                               c.id === cat.id ? { ...c, image: reader.result as string } : c
                                             );
                                             updateHomeConfig({ ...homeConfig, categories: newCats });
                                             setEditingCategory(null);
                                           };
                                           reader.readAsDataURL(file);
                                         }
                                       }}
                                     />
                                  </label>
                                  <input 
                                    autoFocus
                                    defaultValue={cat.image.startsWith('data:') ? '' : cat.image}
                                    placeholder="Paste URL..."
                                    onBlur={(e) => {
                                      if (e.target.value) {
                                        const newCats = homeConfig.categories.map(c => 
                                          c.id === cat.id ? { ...c, image: e.target.value } : c
                                        );
                                        updateHomeConfig({ ...homeConfig, categories: newCats });
                                      }
                                      setEditingCategory(null);
                                    }}
                                    className="flex-1 bg-white/5 border border-blue-500/30 rounded-lg px-3 py-1.5 text-[9px] text-white focus:outline-none font-mono"
                                  />
                               </div>
                           ) : (
                               <p className="text-[8px] text-gray-500 truncate font-mono opacity-60 italic">{cat.image}</p>
                           )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingCategory(editingCategory === cat.id ? null : cat.id)}
                            className="p-2 bg-white/5 rounded-lg text-blue-500 border border-white/5 active:scale-90"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => deleteCategory(cat.id)}
                            className="p-2 bg-white/5 rounded-lg text-red-500 border border-white/5 active:scale-90"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                     </div>
                  </GlassCard>
                ))}
              </div>
            </div>
            {/* Mode Management */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex justify-between items-center px-1 mb-6">
                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Game Modes (Sub-Categories)</h3>
                <button 
                  onClick={() => {
                    setModeForm({ name: '', parentId: homeConfig.categories[0]?.id || '', image: '' });
                    setShowModeForm(!showModeForm);
                  }}
                  className="p-2 bg-blue-600/20 text-blue-500 rounded-xl border border-blue-500/30"
                >
                   {showModeForm ? <ArrowLeft size={16} /> : <Plus size={16} />}
                </button>
              </div>

              <AnimatePresence>
                {showModeForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <GlassCard className="p-6 border-blue-500/30 bg-blue-500/[0.03] space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                           <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Mode Name</label>
                           <input 
                             placeholder="Headshot Match"
                             value={modeForm.name}
                             onChange={e => setModeForm({...modeForm, name: e.target.value})}
                             className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white"
                           />
                         </div>
                         <div className="space-y-1">
                           <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Parent Game</label>
                           <select 
                             className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white appearance-none"
                             value={modeForm.parentId}
                             onChange={e => setModeForm({...modeForm, parentId: e.target.value})}
                           >
                             {homeConfig.categories.map(c => (
                               <option key={c.id} value={c.id} className="bg-[#0A0A0B]">{c.name}</option>
                             ))}
                           </select>
                         </div>
                       </div>
                       <div className="space-y-1">
                         <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Cover Image (Upload or URL)</label>
                         <div className="flex gap-2">
                           <label className="flex-1 cursor-pointer">
                              <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                                 <PlusCircle size={16} className="text-blue-500" />
                                 <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">
                                   {modeForm.image.startsWith('data:') ? '✅ Done' : 'UPLOAD'}
                                 </span>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setModeForm({...modeForm, image: reader.result as string});
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                           </label>
                           <input 
                             placeholder="OR PASTE URL..."
                             value={modeForm.image.startsWith('data:') ? '' : modeForm.image}
                             onChange={e => setModeForm({...modeForm, image: e.target.value})}
                             className="flex-[2] bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-mono"
                           />
                         </div>
                       </div>
                       <GradientButton 
                         fullWidth 
                         className="h-12"
                         onClick={() => {
                            addMode({
                              ...modeForm,
                              id: Math.random().toString(36).substr(2, 9)
                            });
                            setShowModeForm(false);
                         }}
                       >
                         <span className="text-[10px] font-black uppercase italic tracking-widest">Add Mode</span>
                       </GradientButton>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 gap-4">
                {homeConfig.modes.map((mode) => (
                  <GlassCard key={mode.id} className="p-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 shrink-0 bg-black flex items-center justify-center">
                           {mode.image && mode.image.length > 0 ? (
                             <img src={mode.image} className="w-full h-full object-cover" />
                           ) : (
                             <Gamepad2 size={24} className="text-white/10" />
                           )}
                        </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black text-white italic tracking-tighter uppercase mb-0.5">{mode.name}</h4>
                            <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest mb-1 italic">
                              Part of: {homeConfig.categories.find(c => c.id === mode.parentId)?.name || 'Unknown'}
                            </p>
                            {editingMode === mode.id ? (
                               <div className="flex gap-2 items-center">
                                  <label className="p-2 bg-blue-600/20 rounded-lg text-blue-500 border border-blue-500/30 cursor-pointer active:scale-95 transition-transform">
                                     <PlusCircle size={14} />
                                     <input 
                                       type="file" 
                                       className="hidden" 
                                       accept="image/*" 
                                       onChange={(e) => {
                                         const file = e.target.files?.[0];
                                         if (file) {
                                           const reader = new FileReader();
                                           reader.onloadend = () => {
                                             const newModes = homeConfig.modes.map(m => 
                                               m.id === mode.id ? { ...m, image: reader.result as string } : m
                                             );
                                             updateHomeConfig({ ...homeConfig, modes: newModes });
                                             setEditingMode(null);
                                           };
                                           reader.readAsDataURL(file);
                                         }
                                       }}
                                     />
                                  </label>
                                  <input 
                                    autoFocus
                                    defaultValue={mode.image.startsWith('data:') ? '' : mode.image}
                                    placeholder="Paste URL..."
                                    onBlur={(e) => {
                                      if (e.target.value) {
                                        const newModes = homeConfig.modes.map(m => 
                                          m.id === mode.id ? { ...m, image: e.target.value } : m
                                        );
                                        updateHomeConfig({ ...homeConfig, modes: newModes });
                                      }
                                      setEditingMode(null);
                                    }}
                                    className="flex-1 bg-white/5 border border-blue-500/30 rounded-lg px-3 py-1.5 text-[9px] text-white focus:outline-none font-mono"
                                  />
                               </div>
                            ) : (
                                <p className="text-[8px] text-gray-500 truncate font-mono opacity-60 italic">{mode.image}</p>
                            )}
                         </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingMode(editingMode === mode.id ? null : mode.id)}
                            className="p-2 bg-white/5 rounded-lg text-blue-500 border border-white/5 active:scale-90"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => deleteMode(mode.id)}
                            className="p-2 bg-white/5 rounded-lg text-red-500 border border-white/5 active:scale-90"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                     </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'SYSTEM' ? (
          <div className="space-y-8 pb-10">
            <GlassCard className="p-6 border-blue-500/30 bg-blue-500/[0.02] space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">System Settings</h3>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${systemForm.maintenanceMode ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {systemForm.maintenanceMode ? 'Maintenance ON' : 'System Live'}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">App Name</label>
                      <input 
                         className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-bold italic"
                         value={systemForm.appName}
                         onChange={e => setSystemForm({...systemForm, appName: e.target.value})}
                         placeholder="e.g. Arena Legends"
                      />
                  </div>

                  <div className="space-y-1">
                      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">APK Download Link (Optional)</label>
                      <input 
                         className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-bold italic"
                         value={systemForm.apkLink}
                         onChange={e => setSystemForm({...systemForm, apkLink: e.target.value})}
                         placeholder="e.g. https://your-site.com/app.apk"
                      />
                      <p className="text-[7px] text-gray-600 font-bold uppercase pl-1 mt-1">Leave blank to use Web-App (PWA) installation</p>
                  </div>
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                         <p className="text-xs font-black text-white uppercase italic">Maintenance Mode</p>
                         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Disconnects all users (except admins)</p>
                      </div>
                      <button 
                        onClick={() => setSystemForm({...systemForm, maintenanceMode: !systemForm.maintenanceMode})}
                        className={`w-12 h-6 rounded-full relative transition-colors ${systemForm.maintenanceMode ? 'bg-red-600' : 'bg-white/10'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${systemForm.maintenanceMode ? 'left-7' : 'left-1'}`} />
                      </button>
                   </div>

                  <div className="space-y-1">
                     <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">App Logo (Upload or URL)</label>
                     <div className="flex gap-3">
                        <label className="w-12 h-12 bg-black rounded-xl border border-white/10 shrink-0 overflow-hidden flex items-center justify-center cursor-pointer group">
                           {systemForm.appLogo && systemForm.appLogo.length > 0 ? (
                             <img src={systemForm.appLogo} className="w-full h-full object-cover" />
                           ) : (
                             <Gamepad2 size={24} className="text-white/10" />
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <PlusCircle size={14} className="text-white" />
                           </div>
                           <input 
                             type="file" 
                             className="hidden" 
                             accept="image/*" 
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setSystemForm({...systemForm, appLogo: reader.result as string});
                                  reader.readAsDataURL(file);
                               }
                             }}
                           />
                        </label>
                        <input 
                           className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-mono"
                           value={systemForm.appLogo.startsWith('data:') ? '' : systemForm.appLogo}
                           onChange={e => setSystemForm({...systemForm, appLogo: e.target.value})}
                           placeholder="OR PASTE LOGO URL..."
                        />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Home Page Ticker (Notice)</label>
                     <textarea 
                        className="w-full h-24 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none resize-none font-medium"
                        value={systemForm.tickerAnnouncement}
                        onChange={e => setSystemForm({...systemForm, tickerAnnouncement: e.target.value})}
                        placeholder="ENTER IMPORTANT NEWS HERE..."
                     />
                  </div>

                  <div className="space-y-1">
                     <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Default Match Rules (Line by Line)</label>
                     <textarea 
                        className="w-full h-32 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none resize-none font-medium"
                        value={(homeConfig.defaultTournamentRules || []).join('\n')}
                        onChange={e => updateHomeConfig({...homeConfig, defaultTournamentRules: e.target.value.split('\n')})}
                        placeholder="ENTER DEFAULT RULES..."
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Support Telegram</label>
                        <input 
                           className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-mono"
                           value={systemForm.telegramLink}
                           onChange={e => setSystemForm({...systemForm, telegramLink: e.target.value})}
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Telegram Group</label>
                        <input 
                           className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-mono"
                           value={systemForm.telegramGroupLink}
                           onChange={e => setSystemForm({...systemForm, telegramGroupLink: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">YouTube Channel</label>
                     <input 
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-mono"
                        value={systemForm.youtubeLink}
                        onChange={e => setSystemForm({...systemForm, youtubeLink: e.target.value})}
                     />
                  </div>

                  {/* Banner Management */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                              <LayoutGrid size={18} />
                           </div>
                           <h4 className="text-sm font-black text-white italic tracking-tighter uppercase leading-none">Home <span className="text-blue-500">Banners</span></h4>
                        </div>
                        <button 
                          onClick={() => {
                            const newBanners = [...homeConfig.banners, { image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop', link: '' }];
                            updateHomeConfig({ ...homeConfig, banners: newBanners });
                          }}
                          className="px-3 py-1.5 bg-blue-600 rounded-lg text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-2"
                        >
                           <PlusCircle size={12} /> Add New
                        </button>
                     </div>

                     <div className="space-y-3">
                        {homeConfig.banners.map((banner, idx) => (
                           <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                              <div className="flex justify-between items-center">
                                 <span className="text-[8px] font-black text-blue-500 uppercase italic">Banner #{idx + 1}</span>
                                 <button 
                                   onClick={() => {
                                     const newBanners = homeConfig.banners.filter((_, i) => i !== idx);
                                     updateHomeConfig({ ...homeConfig, banners: newBanners });
                                   }}
                                   className="text-red-500"
                                 >
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                              <div className="flex gap-3">
                                 <label className="w-16 h-10 bg-black rounded-lg border border-white/10 shrink-0 overflow-hidden flex items-center justify-center cursor-pointer group">
                                    <img src={banner.image} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                       <PlusCircle size={12} className="text-white" />
                                    </div>
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*" 
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                           const reader = new FileReader();
                                           reader.onloadend = () => {
                                              const newBanners = [...homeConfig.banners];
                                              newBanners[idx] = { ...newBanners[idx], image: reader.result as string };
                                              updateHomeConfig({ ...homeConfig, banners: newBanners });
                                           };
                                           reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                 </label>
                                 <div className="flex-1 space-y-2">
                                    <input 
                                      className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-[9px] text-white focus:outline-none font-mono"
                                      value={banner.image.startsWith('data:') ? '' : banner.image}
                                      placeholder="OR PASTE URL..."
                                      onChange={e => {
                                        const newBanners = [...homeConfig.banners];
                                        newBanners[idx] = { ...newBanners[idx], image: e.target.value };
                                        updateHomeConfig({ ...homeConfig, banners: newBanners });
                                      }}
                                    />
                                    <input 
                                      className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-[9px] text-blue-400 focus:outline-none font-mono"
                                      value={banner.link || ''}
                                      placeholder="OPTONAL LINK (https://...)"
                                      onChange={e => {
                                        const newBanners = [...homeConfig.banners];
                                        newBanners[idx] = { ...newBanners[idx], link: e.target.value };
                                        updateHomeConfig({ ...homeConfig, banners: newBanners });
                                      }}
                                    />
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Auto Match Scheduler */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                           <Trophy size={18} />
                        </div>
                        <h4 className="text-sm font-black text-white italic tracking-tighter uppercase leading-none">Auto Match <span className="text-blue-500">Scheduler</span></h4>
                     </div>

                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black text-white uppercase italic">Enable Daily Matches</p>
                              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-1">Automatic match creation every 24h</p>
                           </div>
                           <button 
                             onClick={() => updateAutoMatchConfig({ enabled: !homeConfig.autoMatchConfig?.enabled })}
                             className={`w-12 h-6 rounded-full relative transition-colors ${homeConfig.autoMatchConfig?.enabled ? 'bg-blue-600' : 'bg-white/10'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${homeConfig.autoMatchConfig?.enabled ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>

                        {homeConfig.autoMatchConfig?.enabled && (
                          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                   <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Daily Match Count</label>
                                   <input 
                                     type="number"
                                     className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                                     value={homeConfig.autoMatchConfig?.dailyMatchCount}
                                     onChange={e => updateAutoMatchConfig({ dailyMatchCount: Number(e.target.value) })}
                                   />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest pl-1">Next Schedule</label>
                                   <div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-blue-400 font-black italic">
                                      {homeConfig.autoMatchConfig?.nextScheduleTime ? new Date(homeConfig.autoMatchConfig.nextScheduleTime).toLocaleString() : 'N/A'}
                                   </div>
                                </div>
                             </div>
                             <p className="text-[8px] text-gray-600 font-medium italic">* Matches are generated using the most recent "Upcoming" match as a template or system defaults if none found.</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               <GradientButton 
                  fullWidth 
                  className="h-12 mt-4"
                  onClick={() => {
                    updateHomeConfig({
                       ...homeConfig,
                       ...systemForm
                    });
                    addNotification({
                       title: 'System Settings Updated',
                       message: 'Global configuration has been successfully saved.',
                       type: 'SUCCESS'
                    });
                  }}
               >
                  <span className="text-[10px] font-black uppercase italic tracking-widest">Save Global Settings</span>
               </GradientButton>
            </GlassCard>

            <GlassCard className="p-6 border-purple-500/30 bg-purple-500/[0.02] space-y-6">
               <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Push Notification</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-1">Send an alert to all active users</p>
               
               <div className="space-y-4">
                  <input 
                    placeholder="NOTIFICATION TITLE"
                    id="notif-title"
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none font-bold italic"
                  />
                  <textarea 
                    placeholder="MESSAGE CONTENT..."
                    id="notif-body"
                    className="w-full h-24 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none resize-none font-medium"
                  />
                  <div className="flex gap-2">
                     {(['INFO', 'SUCCESS', 'WARNING'] as const).map(type => (
                       <button 
                         key={type}
                         onClick={() => (window as any)._notifType = type}
                         className="flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/5 hover:border-purple-500/50 text-gray-400 hover:text-white"
                       >
                         {type}
                       </button>
                     ))}
                  </div>
               </div>

               <button 
                  onClick={() => {
                    const title = (document.getElementById('notif-title') as HTMLInputElement)?.value;
                    const message = (document.getElementById('notif-body') as HTMLTextAreaElement)?.value;
                    if (!title || !message) return;
                    
                    addNotification({
                       title,
                       message,
                       type: (window as any)._notifType || 'INFO'
                    });
                    
                    (document.getElementById('notif-title') as HTMLInputElement).value = '';
                    (document.getElementById('notif-body') as HTMLTextAreaElement).value = '';
                  }}
                  className="w-full h-12 bg-purple-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest italic"
               >
                  Push Notification Now
               </button>
            </GlassCard>
            
            <GlassCard className="p-6 border-red-500/30 bg-red-500/[0.02] space-y-4">
               <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Debug & Recovery</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                  If matches are not deleting or system seems stuck, use this to clear local cache. 
                  <span className="text-red-500"> Warning: This resets everything to defaults!</span>
               </p>
               <button 
                  onClick={() => {
                    if (window.confirm('WIPE ALL DATA? This will reset matches, users, and settings to factory state. This cannot be undone!')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="w-full h-12 bg-red-600/10 border border-red-600/30 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest italic hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                  <Trash2 size={16} />
                  Reset System Data (Wipe Everything)
               </button>
            </GlassCard>

            <div className="text-center px-6">
               <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Tunex Gaming Platform v2.0</p>
               <p className="text-[8px] text-gray-800 font-bold uppercase mt-2">© 2026 Tunex Esports Management Limited</p>
            </div>
          </div>
        ) : (
          <div className="py-32 text-center">
             <Shield className="text-gray-800 mx-auto mb-4" size={48} />
             <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-xs italic">Section locked for development</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
