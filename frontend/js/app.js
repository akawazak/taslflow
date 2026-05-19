// Fonction utilitaire pour formater la date de manière lisible ("il y a X heures")
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "à l'instant";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
}

// Fonction principale pour charger et injecter le fil d'activité dans le DOM
async function loadActivityFeed(projectId) {
  const container = document.getElementById('activity-feed-container');
  if (!container) return;

  // Affichage d'un loader temporaire
  container.innerHTML = '<p class="loading">Chargement de lhistorique...</p>';

  const activities = await fetchProjectActivities(projectId);

  if (activities.length === 0) {
    container.innerHTML = '<p class="no-activity">Aucune activité enregistrée sur ce projet.</p>';
    return;
  }

  // Génération de la liste HTML
  const listHtml = activities.map(activity => {
    const authorName = activity.user ? activity.user.fullName : "Utilisateur inconnu";
    const timeAgo = formatRelativeTime(activity.createdAt);
    
    return `
      <div class="activity-item">
        <span class="activity-author">${authorName}</span> 
        <span class="activity-details">${activity.details}</span> — 
        <span class="activity-time">${timeAgo}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div class="activity-timeline">${listHtml}</div>`;
}