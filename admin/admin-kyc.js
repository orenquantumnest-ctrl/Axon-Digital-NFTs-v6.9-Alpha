// KYC handler
import supabase from './supabase-client.js';

async function approveKYC(userID) {
  try {
    const { data, error } = await supabase.rpc('approve_kyc', { user_id: userID });

    if (error) {
      console.error('Approve KYC failed:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error during KYC approval:', err);
  }
}

export { approveKYC };