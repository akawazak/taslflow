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
function updateNotificationBadge(count) {
  const badge = document.getElementById('notification-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

// Fonction appelée quand l'utilisateur clique sur une notification
async function handleNotificationClick(id) {
  const readNotification = await markNotificationAsRead(id);
  
  if (readNotification) {
    // 1. Mettre à jour le tableau en mémoire
    unreadNotifications = unreadNotifications.filter(notif => notif._id !== id);
    
    // 2. Mettre à jour le badge en temps réel
    updateNotificationBadge(unreadNotifications.length);
    
    // 3. Archiver dans le LocalStorage
    archiveNotification(readNotification);
    
    // 4. Rafraîchir l'affichage
    renderNotificationDropdown();
  }
}

function archiveNotification(notification) {
  const archived = JSON.parse(localStorage.getItem('archivedNotifications') || '[]');
  archived.push(notification);
  localStorage.setItem('archivedNotifications', JSON.stringify(archived));
}

// Fonction utilitaire pour afficher les notifications dans une liste HTML
function renderNotificationDropdown() {
  const container = document.getElementById('notification-list');
  if (!container) return;
  
  if (unreadNotifications.length === 0) {
    container.innerHTML = '<li>Aucune nouvelle notification</li>';
    return;
  }
  
  container.innerHTML = unreadNotifications.map(notif => `
    <li class="notification-item" onclick="handleNotificationClick('${notif._id}')">
      ${notif.message}
    </li>
  `).join('');
}
