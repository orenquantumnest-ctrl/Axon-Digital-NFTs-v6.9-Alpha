// Admin authentication logic
import supabase from './supabase-client.js';

async function loginAdmin(walletAddress, password) {
  try {
    const { data, error } = await supabase.rpc('admin_login', {
      admin_wallet: walletAddress,
      admin_password: password,
    });

    if (error) {
      console.error('Login failed', error.message);
      return null;
    }
    
    if (data.success) {
      localStorage.setItem('AXON_ADMIN_SESSION', JSON.stringify(data.admin));
      return data.admin;
    }

    return null;
  } catch (err) {
    console.error('Unexpected error during admin login:', err);
  }
}

export { loginAdmin };