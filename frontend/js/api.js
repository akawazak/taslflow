// Fonction pour récupérer l'historique depuis l'API
async function fetchProjectActivities(projectId) {
  try {
    // Supposons que le token JWT est stocké dans le localStorage sous la clé 'token'
    const token = localStorage.getItem('token'); 
    
    const response = await axios.get(`/api/projects/${projectId}/activities`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur Axios activités :", error);
    return [];
  }
}