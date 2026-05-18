// Suppose que l'URL de base et le token sont déjà gérés dans ce fichier
async function fetchNotifications() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/notifications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    return [];
  }
}

async function markNotificationAsRead(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`/api/notifications/${id}/read`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour notification:", error);
    return null;
  }
}