// Realtime websocket handler
import supabase from './supabase-client.js';

function setupRealtimeListeners() {
  const userChannel = supabase.channel('user_activity');
  userChannel.on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
    console.log('User table changed:', payload);
  });
  userChannel.subscribe();

  const transactionChannel = supabase.channel('transactions');
  transactionChannel.on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
    console.log('Transaction table changed:', payload);
  });
  transactionChannel.subscribe();
}

export { setupRealtimeListeners };