import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define standard types for the application's Supabase Schema based on requirements
export type UserRow = {
  id: string; // UUID
  wallet_address: string;
  role: 'user' | 'admin' | 'finance' | 'support' | 'analyst';
  status: 'verified' | 'pending' | 'banned';
  balance: number;
  created_at: string;
};

export type DepositRow = {
  id: string;
  user_id: string;
  amount: number;
  network: string;
  tx_hash: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
};

export type WithdrawalRow = {
  id: string;
  user_id: string;
  amount: number;
  destination_address: string;
  network: string;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
};

export type TransactionRow = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'plan_purchase' | 'referral_bonus' | 'roi_payout';
  user_id: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  created_at: string;
};

export type PlanRow = {
  id: string;
  name: string;
  price: number;
  roi: number; // e.g., 15 for 15%
  duration_days: number;
  status: 'active' | 'inactive';
  nft_label: string;
  created_at: string;
};

export type ReferralRow = {
  id: string;
  referrer_id: string;
  referred_id: string;
  plan_purchased: string;
  commission_earned: number;
  created_at: string;
};
