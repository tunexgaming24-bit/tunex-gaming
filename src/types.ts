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
  prizePool: number;
  entryFee: number;
  perKill: number;
  prizes: { position: string; prize: number }[];
  version: string;
  map: string;
  startTime: string;
  totalSlots: number;
  joinedSlots: number;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
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

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'ENTRY_FEE' | 'WINNING';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  date: string;
}
