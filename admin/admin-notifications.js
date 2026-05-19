// admin/admin-notifications.js
// Notifications utilities and unread count handling
import supabase from './supabase-client.js';

async function fetchUnreadCount() {
  const { data, error } = await supabase.from('admin_notifications').select('id').eq('read', false);
  if (error) { console.error('Failed to fetch unread notifications', error); return 0; }
  return (data && data.length) || 0;
}

async function markAsRead(id) {
  const { data, error } = await supabase.from('admin_notifications').update({ read: true }).eq('id', id);
  if (error) throw error;
  return data;
}

function renderNotificationBadge(count) {
  const el = document.querySelector('#notification-badge');
  if (!el) return;
  if (count > 0) {
    el.textContent = String(count);
    el.style.display = 'inline-block';
  } else {
    el.style.display = 'none';
  }
}

export { fetchUnreadCount, markAsRead, renderNotificationBadge };
