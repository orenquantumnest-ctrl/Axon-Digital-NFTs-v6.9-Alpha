// Settings configurations
import supabase from './supabase-client.js';

async function updateSettings(settingKey, settingValue) {
  try {
    const { data, error } = await supabase.rpc('update_setting', {
      key: settingKey,
      value: settingValue
    });
    
    if (error) {
      console.error('Failed to update setting:', error.message);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error during settings update:', err);
  }
}

export { updateSettings };