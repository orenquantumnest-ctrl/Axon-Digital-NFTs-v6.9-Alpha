import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define standard types for the application's Supabase Schema (V7.1 Upgrade Layer)
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR' | 'SYSTEM';
export type NFTStatus = 'MINTED' | 'LISTED' | 'SOLD' | 'TRANSFERRED' | 'BURNED';
export type ReferralStatus = 'ACTIVE' | 'BLOCKED' | 'REWARDED' | 'FLAGGED';
export type AuditAction = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'MINT' | 'TRANSFER' | 'REWARD' | 'SYSTEM';

export type ProfileRow = {
  id: string; // UUID references auth.users(id)
  email?: string;
  username?: string;
  role: UserRole;
  avatar_url?: string;
  wallet_address?: string; // May be masked via secure view
  referral_code?: string;
  referred_by?: string;
  total_rewards: number;
  referral_count: number;
  created_at: string;
  updated_at: string;
};

export type NFTRow = {
  id: string; // UUID
  owner_id: string; // UUID
  token_id: string;
  name: string;
  description: string;
  image_url: string;
  status: NFTStatus;
  metadata: any;
  attributes: any;
  minted_at: string;
  updated_at: string;
};

export type ReferralRow = {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  level: number;
  status: ReferralStatus;
  reward_amount: number;
  reward_paid: boolean;
  created_at: string;
  updated_at: string;
};

export type WalletTransactionRow = {
  id: string;
  user_id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'REWARD' | 'TRANSFER' | 'FEE';
  amount: number;
  currency: string;
  reference?: string;
  status: string;
  metadata: any;
  created_at: string;
};

export type AuditLogRow = {
  id: string;
  actor_id: string;
  action: AuditAction;
  entity_type?: string;
  entity_id?: string;
  before_state?: any;
  after_state?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
};

export type SystemMetricsRow = {
  id: string;
  metric_key: string;
  metric_value: number;
  metadata: any;
  recorded_at: string;
};

export type ReferralRewardRow = {
  id: string;
  referral_id: string;
  user_id: string;
  amount: number;
  tier: number;
  is_paid: boolean;
  transaction_ref?: string;
  created_at: string;
};

export type SecurityEventRow = {
  id: string;
  user_id: string;
  event_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  metadata: any;
  created_at: string;
};
