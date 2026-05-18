// Tableau géré en mémoire côté client (consigne respectée)
let unreadNotifications = [];

// Fonction pour récupérer et actualiser les notifications
async function pollNotifications() {
  const notifications = await fetchNotifications();
  unreadNotifications = notifications;
  updateNotificationBadge(unreadNotifications.length);
  renderNotificationDropdown();
}

// Lancement du polling toutes les 30 secondes (30000 ms)
setInterval(pollNotifications, 30000);

// Appel initial au chargement
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('token')) {
    pollNotifications();
  }
});