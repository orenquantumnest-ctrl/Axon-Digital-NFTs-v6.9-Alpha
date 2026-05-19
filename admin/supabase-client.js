// admin/supabase-client.js
// Centralized Supabase client used by admin frontend scripts.
// This file is safe for public browser usage (anon key only). Never include service_role keys here.
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://soulxqkznkzigsvazijp.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4Mn99qeGLSLC00IPHutIQQ_yOm22eHl';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: { 'X-Client-Info': 'axon-admin-v6-netlify' }
  }
});

export default supabase;
