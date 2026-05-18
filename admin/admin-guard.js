// Admin guard for route protection
import supabase from './supabase-client.js';

async function validateAdminSession() {
  const session = localStorage.getItem('AXON_ADMIN_SESSION');
  if (!session) {
    window.location.href = '/login.html';
    return;
  }

  try {
    const sessionData = JSON.parse(session);
    const { data, error } = await supabase.auth.getUser(sessionData.token);

    if (error || !data) {
      localStorage.removeItem('AXON_ADMIN_SESSION');
      window.location.href = '/login.html';
    }
  } catch (err) {
    console.error('Failed to validate admin session:', err);
    localStorage.removeItem('AXON_ADMIN_SESSION');
    window.location.href = '/login.html';
  }
}

export { validateAdminSession };