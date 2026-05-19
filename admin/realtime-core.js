// admin/realtime-core.js
// Centralized realtime subscription manager using Supabase Realtime channels.
import supabase from './supabase-client.js';

const subscriptions = [];

function subscribeToTable(table, callback) {
  const channel = supabase.channel(`${table}_channel`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, payload => callback(payload))
    .subscribe();

  subscriptions.push(channel);
  return channel;
}

function unsubscribeAll() {
  subscriptions.forEach(ch => ch.unsubscribe());
}

export { subscribeToTable, unsubscribeAll };
