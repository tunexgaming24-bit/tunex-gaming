import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tournament, Notification, MOCK_USER, MOCK_TOURNAMENTS, MOCK_NOTIFICATIONS, HomeConfig, MOCK_HOME_CONFIG, Participation, MOCK_PARTICIPATIONS, Transaction, PaymentConfig, MOCK_TRANSACTIONS, MOCK_PAYMENT_CONFIG, GameCategory, GameMode, AutoMatchConfig } from '../data/mockData';

type Page = 'home' | 'tournaments' | 'match-details' | 'wallet' | 'notifications' | 'profile' | 'admin';

interface AppContextType {
  user: User | null;
  tournaments: Tournament[];
  participations: Participation[];
  notifications: Notification[];
  transactions: Transaction[];
  paymentConfig: PaymentConfig;
  homeConfig: HomeConfig;
  users: User[];
  page: Page;
  setPage: (page: Page) => void;
  activeGame: string | null;
  setActiveGame: (game: string | null) => void;
  selectedTournament: Tournament | null;
  setSelectedTournament: (tournament: Tournament | null) => void;
  login: (email: string, password?: string) => void;
  register: (name: string, email: string, password?: string, referralCode?: string) => void;
  logout: () => void;
  joinTournament: (tournamentId: string, gameName: string, agreedToRules: boolean, teammates?: string[]) => { success: boolean; message?: string };
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  updateMatchStatus: (id: string, status: 'UPCOMING' | 'LIVE' | 'COMPLETED') => void;
  distributePrizes: (tournamentId: string, resultImage: string, results: { userId: string, userName: string, kills: number, rank: number, prize: number }[]) => void;
  toggleUserBan: (userId: string) => void;
  updateUserRole: (userId: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'SUB_ADMIN' | 'USER') => void;
  addCategory: (category: GameCategory) => void;
  deleteCategory: (id: string) => void;
  addMode: (mode: GameMode) => void;
  deleteMode: (id: string) => void;
  addCoins: (amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'time' | 'status'>) => void;
  updateTransactionStatus: (id: string, status: 'COMPLETED' | 'REJECTED') => void;
  updatePaymentConfig: (config: PaymentConfig) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Partial<Notification>) => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  updateHomeConfig: (config: HomeConfig) => void;
  updateProfile: (updates: Partial<User>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateAutoMatchConfig: (config: Partial<AutoMatchConfig>) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(MOCK_PAYMENT_CONFIG);
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(MOCK_HOME_CONFIG);
  const [users, setUsers] = useState<User[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<Page>('home');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUsers = localStorage.getItem('tunex_all_users');
      let currentUsers = [];
      if (savedUsers) {
        currentUsers = JSON.parse(savedUsers);
        setUsers(currentUsers);
      } else {
        currentUsers = [MOCK_USER];
        setUsers(currentUsers);
        localStorage.setItem('tunex_all_users', JSON.stringify(currentUsers));
      }

      const savedUser = localStorage.getItem('tunex_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        // Refresh session user from the latest users list to keep stats in sync
        const refreshed = currentUsers.find((curr: User) => curr.email.toLowerCase() === u.email.toLowerCase());
        setUser(refreshed || u);
      }
      
      const savedHomeConfig = localStorage.getItem('tunex_home_config');
      if (savedHomeConfig) {
        setHomeConfig(prev => ({ ...prev, ...JSON.parse(savedHomeConfig) }));
      }

      const savedPaymentConfig = localStorage.getItem('tunex_payment_config');
      if (savedPaymentConfig) {
        setPaymentConfig(prev => ({ ...prev, ...JSON.parse(savedPaymentConfig) }));
      }

      const savedTournaments = localStorage.getItem('tunex_tournaments');
      if (savedTournaments) {
        setTournaments(JSON.parse(savedTournaments));
      } else {
        setTournaments(MOCK_TOURNAMENTS);
      }

      const savedParticipations = localStorage.getItem('tunex_participations');
      if (savedParticipations) {
        setParticipations(JSON.parse(savedParticipations));
      } else {
        setParticipations(MOCK_PARTICIPATIONS);
      }

      const savedTransactions = localStorage.getItem('tunex_transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        setTransactions(MOCK_TRANSACTIONS);
      }

      const savedNotifications = localStorage.getItem('tunex_notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        setNotifications(MOCK_NOTIFICATIONS);
      }

      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tunex_all_users', JSON.stringify(users));
    }
  }, [users, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tunex_tournaments', JSON.stringify(tournaments));
    }
  }, [tournaments, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tunex_participations', JSON.stringify(participations));
    }
  }, [participations, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tunex_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const login = (email: string, password?: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // We need to look at the latest users state
    setUsers(currentUsers => {
      const existingUser = currentUsers?.find?.(u => u.email.toLowerCase() === normalizedEmail);
      
      if (!existingUser) {
        addNotification({
          title: 'Login Error',
          message: 'No account found with this email.',
          type: 'WARNING'
        });
        return currentUsers;
      }

      if (password && existingUser.password && existingUser.password !== password) {
        addNotification({
          title: 'Login Error',
          message: 'Incorrect password.',
          type: 'WARNING'
        });
        return currentUsers;
      }

      setUser(existingUser);
      localStorage.setItem('tunex_user', JSON.stringify(existingUser));
      setPage('home');
      return currentUsers;
    });
  };

  const register = (name: string, email: string, password?: string, referralCode?: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    setUsers(currentUsers => {
      const existingUser = currentUsers?.find?.(u => u.email.toLowerCase() === normalizedEmail);
      
      if (existingUser) {
        addNotification({
          title: 'Registration Error',
          message: 'Email already registered. Try logging in.',
          type: 'WARNING'
        });
        return currentUsers;
      }

      // Check if this email is an admin
      const adminRecord = homeConfig.adminEmails?.find?.(a => a.email.toLowerCase() === normalizedEmail);
      
      const newUser: User = { 
        id: 'u-' + Date.now() + Math.random().toString(36).substr(2, 4),
        name: name,
        email: normalizedEmail, 
        password,
        avatar: '',
        role: adminRecord ? adminRecord.role : 'USER',
        coins: adminRecord ? (adminRecord.role === 'SUPER_ADMIN' ? 999999 : 0) : 0,
        tokens: 0,
        matchesPlayed: 0,
        kills: 0,
        earnings: 0,
        wins: 0,
        isVerified: !!adminRecord,
        isBanned: false,
        referralCode: normalizedEmail.split('@')[0].toUpperCase() + Math.floor(Math.random() * 1000)
      };
      
      if (normalizedEmail === 'gamingazim240@gmail.com') {
        newUser.role = 'SUPER_ADMIN';
        newUser.isVerified = true;
      }

      let finalUsers = [...currentUsers];

      if (referralCode && referralCode !== newUser.referralCode) {
        const referrer = currentUsers?.find?.(u => u.referralCode === referralCode);
        if (referrer) {
          newUser.referredBy = referralCode;
          newUser.coins += homeConfig.referralBonus;
          
          finalUsers = currentUsers.map(u => 
            u.id === referrer.id ? { ...u, coins: u.coins + homeConfig.referralBonus, referralCount: (u.referralCount || 0) + 1 } : u
          );

          addNotification({
            title: 'Referral Bonus!',
            message: `You earned ৳${homeConfig.referralBonus} using referral code ${referralCode}`,
            type: 'SUCCESS'
          });
        }
      }

      finalUsers.push(newUser);
      localStorage.setItem('tunex_all_users', JSON.stringify(finalUsers));
      localStorage.setItem('tunex_user', JSON.stringify(newUser));
      setUser(newUser);
      setPage('home');
      
      addNotification({
        title: 'Welcome!',
        message: 'Your account has been created successfully.',
        type: 'SUCCESS'
      });

      return finalUsers;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tunex_user');
  };

  const joinTournament = (tournamentId: string, gameName: string, agreedToRules: boolean, teammates?: string[]) => {
    if (!user) return { success: false, message: 'Please login first' };
    
    if (user.isBanned) {
      return { success: false, message: 'Your account is banned. Contact support.' };
    }

    if (!agreedToRules) {
      return { success: false, message: 'You must agree to the anti-cheat rules' };
    }
    
    const idToMatch = String(tournamentId);
    const tournament = tournaments.find(t => String(t.id) === idToMatch);
    if (!tournament) return { success: false, message: 'Tournament not found' };
    
    if (tournament.joinedSlots >= tournament.totalSlots) {
      return { success: false, message: 'Tournament is full' };
    }

    if (user.coins < tournament.entryFee) {
      return { success: false, message: 'Insufficient balance' };
    }

    // Check if already joined
    const alreadyJoined = participations.some(p => p.userId === user.id && p.tournamentId === tournamentId);
    if (alreadyJoined) {
      return { success: false, message: 'You have already joined this match' };
    }

    // Deduct coins
    const updatedUser = { ...user, coins: user.coins - tournament.entryFee, matchesPlayed: user.matchesPlayed + 1 };
    setUser(updatedUser);
    localStorage.setItem('tunex_user', JSON.stringify(updatedUser));

    // Update Tournament slots
    setTournaments(prev => prev.map(t => 
      t.id === tournamentId ? { ...t, joinedSlots: t.joinedSlots + 1 } : t
    ));

    // Add Participation
    const newParticipation: Participation = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      tournamentId,
      gameName,
      teammates,
      slot: tournament.joinedSlots + 1,
      joinedAt: new Date().toISOString()
    };
    setParticipations(prev => [...prev, newParticipation]);

    // Add Notification
    const newNotif: Notification = {
      id: Math.random().toString(),
      title: 'সাফল্যজনকভাবে জয়েন হয়েছে',
      message: `You joined ${tournament.title}. Slot: ${newParticipation.slot}`,
      time: 'Just now',
      read: false,
      type: 'SUCCESS'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: 'সাফল্যজনকভাবে জয়েন হয়েছে' };
  };

  const addTournament = (tournament: Tournament) => {
    setTournaments(prev => {
      const newState = [tournament, ...prev];
      localStorage.setItem('tunex_tournaments', JSON.stringify(newState));
      return newState;
    });
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    const idToMatch = String(id);
    setTournaments(prev => {
      const newState = prev.map(t => String(t.id) === idToMatch ? { ...t, ...updates } : t);
      localStorage.setItem('tunex_tournaments', JSON.stringify(newState));
      return newState;
    });
    if (selectedTournament && String(selectedTournament.id) === idToMatch) {
      setSelectedTournament(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteTournament = (id: string) => {
    const idToMatch = String(id).trim();
    console.log('[DEBUG] deleteTournament called with:', idToMatch);
    
    // 1. First update storage to ensure persistence
    try {
      const currentTournaments = JSON.parse(localStorage.getItem('tunex_tournaments') || '[]');
      const updatedTournaments = currentTournaments.filter((t: any) => String(t.id).trim() !== idToMatch);
      localStorage.setItem('tunex_tournaments', JSON.stringify(updatedTournaments));
      console.log('[DEBUG] LocalStorage updated. Remaining:', updatedTournaments.length);

      const currentParticipations = JSON.parse(localStorage.getItem('tunex_participations') || '[]');
      const updatedParticipations = currentParticipations.filter((p: any) => String(p.tournamentId).trim() !== idToMatch);
      localStorage.setItem('tunex_participations', JSON.stringify(updatedParticipations));
    } catch (e) {
      console.error('[DEBUG] Storage sync error:', e);
    }

    // 2. Update React State
    setTournaments(prev => {
      const filtered = prev.filter(t => String(t.id).trim() !== idToMatch);
      return [...filtered];
    });

    setParticipations(prev => {
      const filtered = prev.filter(p => String(p.tournamentId).trim() !== idToMatch);
      return [...filtered];
    });
    
    if (selectedTournament && String(selectedTournament.id).trim() === idToMatch) {
      setSelectedTournament(null);
    }
    
    addNotification({
      title: 'ম্যাচ ডিলিট করা হয়েছে',
      message: `Match #${idToMatch} results and data removed.`,
      type: 'WARNING'
    });
  };

  const updateMatchStatus = (id: string, status: 'UPCOMING' | 'LIVE' | 'COMPLETED') => {
    const idToMatch = String(id);
    setTournaments(prev => prev.map(t => String(t.id) === idToMatch ? { ...t, status } : t));
  };

  const distributePrizes = (tournamentId: string, resultImage: string, results: { userId: string, userName: string, kills: number, rank: number, prize: number }[]) => {
    const idToMatch = String(tournamentId);
    setTournaments(prev => prev.map(t => {
      if (String(t.id) === idToMatch) {
        return { ...t, status: 'COMPLETED', resultImage, results };
      }
      return t;
    }));

    // Update users state and potentially current user
    setUsers(currentUsers => {
      const updatedUsers = currentUsers.map(u => {
        const result = results.find(r => r.userId === u.id);
        if (result) {
          return {
            ...u,
            coins: u.coins + result.prize,
            earnings: u.earnings + result.prize,
            matchesPlayed: u.matchesPlayed + 1,
            kills: u.kills + result.kills,
            wins: result.rank === 1 ? u.wins + 1 : u.wins
          };
        }
        return u;
      });

      // Update current user if they were in the results
      const myResult = results.find(r => r.userId === user?.id);
      if (myResult && user) {
        const updatedCurrentUser = updatedUsers.find(u => u.id === user.id);
        if (updatedCurrentUser) {
          setUser(updatedCurrentUser);
          localStorage.setItem('tunex_user', JSON.stringify(updatedCurrentUser));
          
          addNotification({
            title: 'Match Payout!',
            message: `You earned ৳${myResult.prize} from match #${tournamentId}`,
            type: 'SUCCESS'
          });
        }
      }

      return updatedUsers;
    });
  };

  const toggleUserBan = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
    if (user?.id === userId) {
      const updatedUser = { ...user, isBanned: !user.isBanned };
      setUser(updatedUser);
      localStorage.setItem('tunex_user', JSON.stringify(updatedUser));
    }
  };

  const updateUserRole = (userId: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'SUB_ADMIN' | 'USER') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    if (user?.id === userId) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('tunex_user', JSON.stringify(updatedUser));
    }
  };

  const addCategory = (category: GameCategory) => {
    setHomeConfig(prev => ({
      ...prev,
      categories: [...prev.categories, category]
    }));
  };

  const deleteCategory = (id: string) => {
    setHomeConfig(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  };

  const addMode = (mode: GameMode) => {
    setHomeConfig(prev => ({
      ...prev,
      modes: [...prev.modes, mode]
    }));
  };

  const deleteMode = (id: string) => {
    setHomeConfig(prev => ({
      ...prev,
      modes: prev.modes.filter(m => m.id !== id)
    }));
  };

  const addCoins = (amount: number) => {
    if (!user) return;
    const updatedUser = { ...user, coins: user.coins + amount };
    setUser(updatedUser);
    localStorage.setItem('tunex_user', JSON.stringify(updatedUser));
  };

  const addTransaction = (txn: Omit<Transaction, 'id' | 'time' | 'status'>) => {
    const newTxn: Transaction = {
      ...txn,
      id: 'txn_' + Math.random().toString(36).substr(2, 9),
      time: new Date().toISOString(),
      status: 'PENDING'
    };
    setTransactions(prev => [newTxn, ...prev]);

    // Notify info
    addNotification({
      title: txn.type === 'DEPOSIT' ? 'Deposit Requested' : 'Withdrawal Requested',
      message: `Your request for ৳${txn.amount} has been submitted for review.`,
      type: 'INFO'
    });
  };

  const updateTransactionStatus = (id: string, status: 'COMPLETED' | 'REJECTED') => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, status };
        // If deposit completed, add coins to user
        if (status === 'COMPLETED' && t.type === 'DEPOSIT') {
          // We would normally find the user, but since it's a mock we'll update the current user if matches
          if (user?.id === t.userId) {
            addCoins(t.amount);
          }
        }
        // Notify user
        addNotification({
          title: `Transaction ${status}`,
          message: `${t.type} of ৳${t.amount} was ${status.toLowerCase()}.`,
          type: status === 'COMPLETED' ? 'SUCCESS' : 'WARNING'
        });
        return updated;
      }
      return t;
    }));
  };

  const updatePaymentConfig = (config: PaymentConfig) => {
    setPaymentConfig(config);
    localStorage.setItem('tunex_payment_config', JSON.stringify(config));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (notif: Partial<Notification>) => {
    const newNotif: Notification = {
      id: Math.random().toString(),
      title: notif.title || 'Notification',
      message: notif.message || '',
      time: 'Just now',
      read: false,
      type: notif.type || 'INFO'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateHomeConfig = (config: HomeConfig) => {
    setHomeConfig(config);
    localStorage.setItem('tunex_home_config', JSON.stringify(config));
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    localStorage.setItem('tunex_user', JSON.stringify(updatedUser));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
      localStorage.setItem('tunex_user', JSON.stringify({ ...user, ...updates }));
    }
  };

  const updateAutoMatchConfig = (config: Partial<AutoMatchConfig>) => {
    const newConfig = { ...homeConfig.autoMatchConfig, ...config } as AutoMatchConfig;
    updateHomeConfig({ ...homeConfig, autoMatchConfig: newConfig });
  };

  // Auto Match logic refactored for startup and background checks
  const runAutoMatchGeneration = (config: AutoMatchConfig) => {
    console.log('[SYSTEM] Triggering Auto Match Generation...');
    
    // Find a template match or use defaults
    const template = tournaments.find(t => t.status === 'UPCOMING') || tournaments[0];
    const newTournaments: Tournament[] = [];
    const now = new Date();

    for (let i = 0; i < config.dailyMatchCount; i++) {
      const matchId = Math.floor(100000 + Math.random() * 900000).toString();
      const startTime = new Date(now.getTime() + (i + 1) * 3600000 * 2); // 2 hours apart
      
      newTournaments.push({
        id: matchId,
        title: template ? `${template.category} || #AUTOGEN-${matchId}` : `AUTO MATCH || #${matchId}`,
        game: template?.game || 'Free Fire',
        category: template?.category || 'BR Match',
        type: template?.type || 'SOLO',
        version: 'Mobile',
        map: template?.map || 'Bermuda',
        prizePool: template?.prizePool || 100,
        perKill: template?.perKill || 5,
        prizes: template?.prizes || [{ position: '1st', prize: 100 }],
        entryFee: template?.entryFee || 10,
        startTime: startTime.toISOString(),
        status: 'UPCOMING',
        totalSlots: template?.totalSlots || 48,
        joinedSlots: 0,
        banner: template?.banner || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
        rules: template?.rules || (homeConfig.defaultTournamentRules || [])
      });
    }

    setTournaments(prev => [...newTournaments, ...prev]);
    
    // Update next schedule time to 24 hours from now
    const nextSchedule = new Date(now.getTime() + 86400000).toISOString();
    updateAutoMatchConfig({ 
      nextScheduleTime: nextSchedule,
      lastRunTime: now.toISOString()
    });

    addNotification({
      title: 'System: Auto Matches Added',
      message: `${newTournaments.length} new matches have been automatically generated.`,
      type: 'INFO'
    });
  };

  useEffect(() => {
    if (!homeConfig.autoMatchConfig?.enabled || isLoading) return;

    // Check immediately on mount for missed runs
    const now = new Date();
    const nextRun = new Date(homeConfig.autoMatchConfig!.nextScheduleTime);
    if (now >= nextRun) {
      runAutoMatchGeneration(homeConfig.autoMatchConfig!);
    }

    const checkInterval = setInterval(() => {
      const currentTime = new Date();
      const scheduleTime = new Date(homeConfig.autoMatchConfig!.nextScheduleTime);

      if (currentTime >= scheduleTime) {
        runAutoMatchGeneration(homeConfig.autoMatchConfig!);
      }
    }, 60000); 

    return () => clearInterval(checkInterval);
  }, [homeConfig.autoMatchConfig?.enabled, isLoading]);

  return (
    <AppContext.Provider value={{ 
      user, 
      tournaments, 
      participations,
      notifications, 
      transactions,
      paymentConfig,
      homeConfig,
      users,
      page,
      setPage,
      activeGame,
      setActiveGame,
      selectedTournament,
      setSelectedTournament,
      login, 
      register,
      logout, 
      joinTournament, 
      addTournament,
      updateTournament,
      deleteTournament,
      updateMatchStatus,
      distributePrizes,
      toggleUserBan,
      updateUserRole,
      addCategory,
      deleteCategory,
      addMode,
      deleteMode,
      addCoins, 
      addTransaction,
      updateTransactionStatus,
      updatePaymentConfig,
      markNotificationRead,
      addNotification,
      setNotifications,
      updateHomeConfig,
      updateProfile,
      updateUser,
      updateAutoMatchConfig,
      isLoading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
