// admin/admin-settings.js
// Admin settings management
import supabase from './supabase-client.js';

async function loadSettings() {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) throw error;
  return data;
}

async function saveSetting(key, value) {
  // upsert
  const { data, error } = await supabase.from('settings').upsert({ key, value }, { onConflict: ['key'] });
  if (error) throw error;
  return data;
}

export { loadSettings, saveSetting };
