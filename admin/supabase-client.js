// Supabase client module
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://soulxqkznkzigsvazijp.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_4Mn99qeGLSLC00IPHutIQQ_yOm22eHl';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;