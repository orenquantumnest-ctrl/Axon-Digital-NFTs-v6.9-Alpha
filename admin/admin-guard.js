// admin/admin-guard.js
// Simple route guard that ensures an admin session exists before allowing access.
import { getAdminSession } from './admin-auth.js';

function requireAdminSession(redirectTo = '/admin/login.html') {
  const session = getAdminSession();
  if (!session || !session.admin) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export { requireAdminSession };
