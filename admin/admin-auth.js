// admin/admin-auth.js
// Authentication helpers for admin pages (browser-side helpers)
import supabase from './supabase-client.js';

async function axonAdminLogin(walletAddress, password) {
  // Trim and basic validation
  const wallet = String(walletAddress || '').trim();
  const pass = String(password || '').trim();

  if (!wallet || !pass) throw new Error('Missing credentials');

  // Call Supabase RPC that performs admin validation server-side.
  const response = await supabase.rpc('admin_login', { admin_wallet: wallet, admin_password: pass });

  if (response.error) {
    throw response.error;
  }

  const data = response.data;
  if (!data || data.success !== true) {
    throw new Error(data?.message || 'Authentication failed');
  }

  // Persist minimal admin session in localStorage
  try {
    localStorage.setItem('AXON_ADMIN_SESSION', JSON.stringify({ admin: data.admin, created_at: Date.now() }));
  } catch (e) { console.warn('Failed to save session', e); }

  return data.admin;
}

async function logoutAdmin() {
  try {
    localStorage.removeItem('AXON_ADMIN_SESSION');
    // Optionally call server-side logout RPC
    try { await supabase.rpc('admin_logout'); } catch(_) {}
    window.location.href = '/admin/login.html';
  } catch (err) { console.error('Logout failed', err); }
}

function getAdminSession() {
  try {
    const s = localStorage.getItem('AXON_ADMIN_SESSION');
    if (!s) return null;
    return JSON.parse(s);
  } catch (err) { return null; }
}

export { axonAdminLogin, logoutAdmin, getAdminSession };
