
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  coins: number;
  tokens: number;
  matchesPlayed: number;
  kills: number;
  earnings: number;
  wins: number;
  isVerified: boolean;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SUB_ADMIN' | 'USER';
  isBanned?: boolean;
  referralCode: string;
  referralCount?: number;
  referredBy?: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  category: string;
  type: 'SOLO' | 'DUO' | 'SQUAD';
  version: string;
  map: string;
  prizePool: number;
  perKill: number;
  prizes: { position: string; prize: number }[];
  entryFee: number;
  startTime: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  totalSlots: number;
  joinedSlots: number;
  banner: string;
  rules: string[];
  roomId?: string;
  password?: string;
  resultImage?: string;
  results?: {
    userId: string;
    userName: string;
    kills: number;
    rank: number;
    prize: number;
  }[];
}

export interface Participation {
  id: string;
  userId: string;
  tournamentId: string;
  gameName: string;
  teammates?: string[];
  slot: number;
  joinedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'EARNING' | 'ENTRY_FEE';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  method?: 'BKASH' | 'NAGAD' | 'ROCKET' | 'UPAY';
  senderNumber?: string;
  transactionId?: string;
  receiverNumber?: string;
  time: string;
}

export interface PaymentConfig {
  bkash: string;
  nagad: string;
  rocket: string;
  bkashLabel: string;
  nagadLabel: string;
  rocketLabel: string;
  bkashLogo: string;
  nagadLogo: string;
  rocketLogo: string;
  minDeposit: number;
  minWithdraw: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
}

export interface GameCategory {
  id: string;
  name: string;
  game: string;
  count: number;
  image: string;
}

export interface GameMode {
  id: string;
  parentId: string; // ID of the GameCategory
  name: string;
  image: string;
}

export interface AutoMatchConfig {
  enabled: boolean;
  dailyMatchCount: number;
  templateMatchId?: string;
  nextScheduleTime: string;
  lastRunTime?: string;
}

export interface HomeConfig {
  banners: {
    image: string;
    link?: string;
  }[];
  telegramLink: string;
  telegramGroupLink: string;
  youtubeLink?: string;
  maintenanceMode: boolean;
  tickerAnnouncement: string;
  appLogo: string;
  appName: string;
  apkLink?: string;
  categories: GameCategory[];
  modes: GameMode[];
  referralBonus: number;
  adminEmails: { email: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'SUB_ADMIN' | 'USER' }[];
  defaultTournamentRules: string[];
  autoMatchConfig?: AutoMatchConfig;
}

export const MOCK_HOME_CONFIG: HomeConfig = {
  banners: [
    { image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop', link: 'https://telegram.me' },
    { image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop', link: 'https://youtube.com' }
  ],
  telegramLink: 'https://t.me/your_support',
  telegramGroupLink: 'https://t.me/your_group',
  youtubeLink: 'https://youtube.com/@yourchannel',
  maintenanceMode: false,
  tickerAnnouncement: 'WELCOME TO TUNEX GAMING! ENJOY THE BEST ESPORTS EXPERIENCE. DAILY MATCHES ARE LIVE NOW!',
  appLogo: '/logo.png',
  appName: 'Tunex Gaming',
  apkLink: '/tunex.apk',
  categories: [
    { 
      id: 'free_fire', 
      name: 'Free Fire', 
      game: 'Free Fire',
      count: 2, 
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop' 
    },
    { 
      id: 'ludo_king', 
      name: 'Ludo King', 
      game: 'Ludo King',
      count: 0, 
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop' 
    }
  ],
  modes: [
    { id: 'm1', parentId: 'free_fire', name: 'BR MATCH', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop' },
    { id: 'm2', parentId: 'free_fire', name: 'PRO LEAGUE', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop' },
    { id: 'm3', parentId: 'free_fire', name: 'SURVIVAL', image: 'https://images.unsplash.com/photo-1552824730-cf51ab72421c?q=80&w=400&auto=format&fit=crop' },
    { id: 'm4', parentId: 'free_fire', name: 'CS 4 VS 4', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop' },
  ],
  referralBonus: 5,
  adminEmails: [
    { email: 'gamingazim240@gmail.com', role: 'SUPER_ADMIN' }
  ],
  defaultTournamentRules: [
    'No Hack/Cheat allowed.',
    'Teaming is strictly prohibited.',
    'Room ID/Pass will be shared 15 mins before match.',
    'Minimum Level 40 required.'
  ],
  autoMatchConfig: {
    enabled: false,
    dailyMatchCount: 5,
    nextScheduleTime: new Date(Date.now() + 86400000).toISOString()
  }
};

export const FAKE_LEADERS = [
  { id: 'f1', name: 'Elite_Pro', earnings: 15450, avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop' },
  { id: 'f2', name: 'Sniper_King', earnings: 12200, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: 'f3', name: 'GG_Mamba', earnings: 9800, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
  { id: 'f4', name: 'Shadow_Op', earnings: 7500, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop' },
  { id: 'f5', name: 'Toxic_Bot', earnings: 5400, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop' },
  { id: 'f6', name: 'Raptor_7', earnings: 4200, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Tunex Player',
  email: 'player@tunex.app',
  password: 'TunexPassword',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop',
  coins: 5.00,
  tokens: 15,
  matchesPlayed: 45,
  kills: 128,
  earnings: 5200,
  wins: 12,
  isVerified: true,
  role: 'SUPER_ADMIN',
  isBanned: false,
  referralCode: 'GOLDEN500',
  referralCount: 15
};

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: '100239',
    title: 'BR MATCH || Match No.100239',
    game: 'Free Fire',
    category: 'BR Match',
    type: 'DUO',
    version: 'Mobile',
    map: 'Bermuda',
    prizePool: 860,
    perKill: 10,
    prizes: [
      { position: '1st', prize: 400 },
      { position: '2nd', prize: 200 },
      { position: '3rd', prize: 100 }
    ],
    entryFee: 20,
    startTime: '2026-05-10T16:45:00Z',
    status: 'UPCOMING',
    totalSlots: 48,
    joinedSlots: 36,
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    rules: [
      'No Hack/Cheat allowed.',
      'Teaming is strictly prohibited.',
      'Room ID/Pass will be shared 15 mins before match.',
      'Minimum Level 40 required.'
    ]
  },
  {
    id: '100240',
    title: 'BR MATCH || Match No.100240',
    game: 'Free Fire',
    category: 'BR Match',
    type: 'SOLO',
    version: 'Mobile',
    map: 'Bermuda',
    prizePool: 860,
    perKill: 10,
    prizes: [
      { position: '1st', prize: 500 },
      { position: '2nd', prize: 250 },
      { position: '3rd', prize: 110 }
    ],
    entryFee: 20,
    startTime: '2026-05-10T17:10:00Z',
    status: 'UPCOMING',
    totalSlots: 48,
    joinedSlots: 18,
    banner: 'https://images.unsplash.com/photo-1552824730-cf51ab72421c?q=80&w=800&auto=format&fit=crop',
    rules: ['Follow all standard FF tournament rules.']
  },
  {
    id: '100241',
    title: 'CS 4 VS 4 || Match No.100241',
    game: 'Free Fire',
    category: 'CS 4 VS 4',
    type: 'SQUAD',
    version: 'Mobile',
    map: 'Bermuda',
    prizePool: 450,
    perKill: 5,
    prizes: [
      { position: 'Winners', prize: 450 }
    ],
    entryFee: 100,
    startTime: '2026-05-10T17:35:00Z',
    status: 'UPCOMING',
    totalSlots: 48,
    joinedSlots: 48,
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    rules: ['Tournament Final Rules Apply.']
  }
];

export const MOCK_PARTICIPATIONS: Participation[] = [
  {
    id: 'pt1',
    userId: 'u1',
    tournamentId: '100239',
    gameName: 'GamerOne',
    teammates: ['PLAYER_TWO'],
    slot: 12,
    joinedAt: new Date().toISOString()
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Room Access Granted!',
    message: 'Join now. Room ID: 12998344, Pass: 999',
    time: '2m ago',
    read: false,
    type: 'SUCCESS'
  },
  {
    id: 'n2',
    title: 'Credit Alert',
    message: 'Successfully topped up 500 coins.',
    time: '1h ago',
    read: true,
    type: 'INFO'
  }
];

export const MOCK_PAYMENT_CONFIG: PaymentConfig = {
  bkash: '01712345678',
  nagad: '01812345678',
  rocket: '01912345678',
  bkashLabel: 'bKash',
  nagadLabel: 'Nagad',
  rocketLabel: 'Rocket',
  bkashLogo: 'https://searchlogovector.com/wp-content/uploads/2019/02/bkash-logo-vector.png',
  nagadLogo: 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png',
  rocketLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Dutch_Bangla_Bank_Rocket_logo.svg/1200px-Dutch_Bangla_Bank_Rocket_logo.svg.png',
  minDeposit: 10,
  minWithdraw: 100
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    userId: 'u1',
    type: 'DEPOSIT',
    amount: 500,
    status: 'COMPLETED',
    method: 'BKASH',
    senderNumber: '01711223344',
    transactionId: 'TXN83921029',
    time: '2026-05-10T10:00:00Z'
  }
];
