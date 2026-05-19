// admin/admin-kyc.js
// KYC actions for admin
import supabase from './supabase-client.js';

async function listPendingKYC(limit = 50) {
  const { data, error } = await supabase.from('kyc_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data;
}

async function approveKYC(requestId, reviewerId) {
  const { data, error } = await supabase.from('kyc_requests').update({ status: 'approved', reviewed_by: reviewerId, reviewed_at: new Date() }).eq('id', requestId);
  if (error) throw error;
  return data;
}

async function rejectKYC(requestId, reviewerId, reason) {
  const { data, error } = await supabase.from('kyc_requests').update({ status: 'rejected', reviewed_by: reviewerId, reviewed_at: new Date(), reject_reason: reason }).eq('id', requestId);
  if (error) throw error;
  return data;
}

export { listPendingKYC, approveKYC, rejectKYC };
