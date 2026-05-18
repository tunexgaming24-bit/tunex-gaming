import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User as UserIcon, Settings, Shield, LogOut, Award, Target, Zap, Share2, ArrowLeft, Eye, EyeOff, Lock, ChevronRight, MessageCircle, DollarSign, PlusCircle, Trophy, Users } from 'lucide-react';
import { GlassCard, Badge } from '../components/SharedUI';

const Profile: React.FC = () => {
  const { user, setPage, logout, participations, tournaments, setSelectedTournament, homeConfig, addNotification, updateProfile, users } = useApp();
  const [showPassword, setShowPassword] = useState(false);

  if (!user) return null;

  const myMatches = participations
    .filter(p => p.userId === user.id)
    .map(p => ({
      ...p,
      tournament: tournaments.find(t => t.id === p.tournamentId)
    }))
    .filter(p => p.tournament);

  const isAdminOrHigher = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'SUB_ADMIN';

  const stats = [
    { label: 'Matches', value: user.matchesPlayed, icon: <Award className="text-blue-500" size={18} /> },
    { label: 'Eliminations', value: user.kills, icon: <Target className="text-purple-500" size={18} /> },
    { label: 'Winnings', value: `৳${user.earnings}`, icon: <DollarSign className="text-green-500" size={18} /> },
    { label: 'Referrals', value: user.referralCount || 0, icon: <Share2 className="text-purple-500" size={18} /> },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (user) {
          updateProfile({ avatar: base64String });
          addNotification({
            title: 'Avatar Updated!',
            message: 'Your new profile picture is ready.',
            type: 'SUCCESS'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-24 px-4 pt-4 min-h-screen bg-[#0A0A0B]">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 px-1">
        <div className="flex items-center gap-4">
           <button onClick={() => setPage('home')} className="p-3 bg-white/5 rounded-2xl text-white border border-white/5 active:scale-90">
              <ArrowLeft size={20} />
           </button>
           <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">User<br /><span className="text-blue-500">Profile</span></h2>
        </div>
        <button className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white border border-white/5 transition-all active:scale-95">
            <Settings size={20} />
        </button>
      </div>

      {/* User Info */}
      <GlassCard className="p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform rotate-12">
            <UserIcon size={120} />
        </div>
        
        <div className="flex flex-col items-center">
            <div className="relative mb-6">
                <label className="cursor-pointer block">
                  <div className="w-28 h-28 rounded-[2.5rem] p-1 bg-gradient-to-tr from-blue-600 via-purple-600 to-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center overflow-hidden active:scale-95 transition-transform group">
                      {user.avatar && user.avatar.length > 0 ? (
                        <img 
                          src={user.avatar} 
                          alt="avatar" 
                          className="w-full h-full object-cover rounded-[2.2rem] border-4 border-[#1A1A1D]" 
                        />
                      ) : (
                        <UserIcon size={48} className="text-white/20" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem]">
                         <PlusCircle size={24} className="text-white" />
                      </div>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                {user.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center border-4 border-[#1A1A1D] shadow-xl">
                      <Shield size={18} className="text-white" />
                  </div>
                )}
            </div>
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">{user.name}</h3>
            <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-6">{user.email}</p>
            
            <Badge variant="primary" className="px-6 py-1.5 flex items-center gap-2">
               <Zap size={10} fill="currentColor" /> Pro Member
            </Badge>
        </div>

        {/* Password Display (Requested feature to avoid ID loss) */}
        <div className="mt-8 pt-8 border-t border-white/5">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Lock size={14} className="text-blue-500" />
                 </div>
                 <div>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">Secret Password</p>
                    <p className="text-xs font-mono text-gray-300 font-bold tracking-widest mt-0.5">
                       {showPassword ? (user.password || 'Not Set') : '••••••••'}
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors"
              >
                 {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
           </div>
        </div>
      </GlassCard>

      {/* Refer & Earn */}
      <GlassCard className="mb-8 p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-4 opacity-5 transform -rotate-12">
            <Share2 size={80} />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                  <Share2 size={20} />
               </div>
               <div>
                  <h3 className="text-sm font-black text-white italic tracking-tighter uppercase leading-tight">Refer & Earn</h3>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none mt-1">Get ৳{homeConfig.referralBonus} per referral</p>
               </div>
            </div>
            
            <div className="flex gap-2">
               <div className="flex-1 bg-white/5 border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-between">
                  <div>
                     <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest leading-none mb-1">Your Referral Code</p>
                     <p className="text-sm font-black text-white tracking-widest font-mono">{user.referralCode || 'REF1234'}</p>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(user.referralCode || 'REF1234');
                      addNotification({
                        title: 'Copied!',
                        message: 'Referral code copied to clipboard.',
                        type: 'SUCCESS'
                      });
                    }}
                    className="p-2 bg-blue-600/20 rounded-lg text-blue-500 hover:bg-blue-600/30 transition-colors"
                  >
                     <ArrowLeft className="rotate-180" size={14} />
                  </button>
               </div>
               <button 
                  onClick={() => {
                    const text = `Join Tunex Gaming and win cash! Use my code: ${user.referralCode}. Sign up now!\n\nJoin here: ${window.location.origin}`;
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="bg-blue-500 p-3 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
               >
                  <MessageCircle size={20} />
               </button>
            </div>
         </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="p-4 text-center">
             <div className="flex justify-center mb-2">{stat.icon}</div>
             <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">{stat.label}</p>
             <p className="text-lg font-black text-white italic tracking-tighter">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* My Matches */}
      <div className="mb-8 p-1">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-white italic tracking-tighter uppercase px-2">Matches Joined</h3>
            <span className="text-[8px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-black uppercase tracking-widest leading-none">
               {myMatches.length} Active
            </span>
         </div>
         
         <div className="space-y-4">
            {myMatches.length > 0 ? (
               myMatches.map((m, idx) => (
                  <GlassCard 
                    key={idx} 
                    className="p-4 border-l-4 border-l-blue-500"
                    onClick={() => {
                       setSelectedTournament(m.tournament!);
                       setPage('match-details');
                    }}
                  >
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl overflow-hidden grayscale opacity-50 group-hover:grayscale-0 transition-all bg-white/5 flex items-center justify-center">
                              {m.tournament?.banner && m.tournament.banner.length > 0 ? (
                                <img src={m.tournament.banner} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Zap size={18} className="text-white/10" />
                              )}
                           </div>
                           <div>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Slot #0{m.slot}</p>
                              <h4 className="text-xs font-black text-white uppercase italic tracking-tighter leading-tight">{m.tournament?.title}</h4>
                           </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-700" />
                     </div>
                  </GlassCard>
               ))
            ) : (
               <div className="py-12 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/5 text-center">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest italic">No match found<br/>Join a match to see history</p>
               </div>
            )}
         </div>
      </div>

      {/* Global Leaderboard Section */}
      <div className="mt-12 mb-8">
         <div className="flex justify-between items-center mb-6 px-2">
            <div>
               <h3 className="text-sm font-black text-white italic tracking-tighter uppercase leading-none">Arena Legends</h3>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Top earners of the week</p>
            </div>
            <Trophy size={20} className="text-yellow-500" />
         </div>
         
         <GlassCard className="p-0 overflow-hidden border-white/5 bg-white/[0.02]">
            <div className="divide-y divide-white/5">
                {[...users]
                  .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
                  .slice(0, 5)
                  .map((topUser, idx) => (
                   <div key={topUser.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                      <div className="relative shrink-0">
                         <div className={`w-10 h-10 rounded-xl overflow-hidden border p-0.5 flex items-center justify-center ${
                           idx === 0 ? 'border-yellow-500 bg-yellow-500/10' : 
                           idx === 1 ? 'border-gray-400 bg-gray-400/10' : 
                           idx === 2 ? 'border-amber-700 bg-amber-700/10' : 
                           'border-white/10 bg-white/5'
                         }`}>
                            {topUser.avatar ? (
                               <img src={topUser.avatar} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                               <Users size={16} className="text-white/20" />
                            )}
                         </div>
                         <div className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black italic border border-white/10 ${
                           idx === 0 ? 'bg-yellow-500 text-black' : 
                           idx === 1 ? 'bg-gray-400 text-black' : 
                           idx === 2 ? 'bg-amber-700 text-white' : 
                           'bg-white/10 text-white'
                         }`}>
                           {idx + 1}
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-[11px] font-black text-white uppercase italic tracking-tighter truncate">{topUser.name}</h4>
                         <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-0.5">{topUser.matchesPlayed || 0} matches played</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-green-500 italic tracking-tighter leading-none">৳{topUser.earnings || 0}</p>
                         <p className="text-[7px] text-gray-700 font-black uppercase tracking-widest mt-1">Earnings</p>
                      </div>
                   </div>
                ))}
            </div>
         </GlassCard>
      </div>

      {/* Menu Options */}
      <div className="space-y-4">
        {[
            { label: 'My Wallet', icon: Zap, color: 'text-blue-500', action: () => setPage('wallet') },
            { label: 'Share App', icon: Share2, color: 'text-purple-500', action: () => {
              const shareData = {
                title: 'Tunex Gaming',
                text: 'Join Tunex Gaming and win cash playing your favorite games! Sign up now.',
                url: window.location.origin
              };

              if (navigator.share) {
                navigator.share(shareData).catch(err => {
                  console.log('Share failed:', err);
                  // Fallback to clipboard
                  navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                  addNotification({ title: 'Link Copied!', message: 'Sharing failed, but link is copied!', type: 'SUCCESS' });
                });
              } else {
                navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                addNotification({
                  title: 'Link Copied!',
                  message: 'App link copied to your clipboard.',
                  type: 'SUCCESS'
                });
              }
            } },
            { label: 'Telegram Support', icon: MessageCircle, color: 'text-blue-500', action: () => {
              window.open(homeConfig.telegramLink, '_blank');
            } },
            { label: 'Telegram Group', icon: Users, color: 'text-blue-600', action: () => {
              window.open(homeConfig.telegramGroupLink, '_blank');
            } },
            { label: 'Admin Dashboard', icon: Shield, color: 'text-yellow-500', action: () => setPage('admin'), show: isAdminOrHigher },
            { label: 'Sign Out', icon: LogOut, color: 'text-red-500', action: () => logout() }
        ].filter(i => i.show !== false).map((item, idx) => (
            <GlassCard 
              key={idx} 
              onClick={item.action}
              className="p-5 flex items-center justify-between group active:scale-[0.98] transition-transform"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner ${item.color}`}>
                        <item.icon size={22} />
                    </div>
                    <span className="text-sm font-black text-white italic tracking-tighter uppercase">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-700 group-hover:text-white transition-colors" />
            </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Profile;
