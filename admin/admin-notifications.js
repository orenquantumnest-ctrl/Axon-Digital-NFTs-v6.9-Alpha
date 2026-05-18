// Notifications engine
function displayNotification(message, type='info') {
  const notificationArea = document.getElementById('notification-area');
  if (!notificationArea) {
    console.error('Notification area not found!');
    return;
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerText = message;

  notificationArea.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

export { displayNotification };