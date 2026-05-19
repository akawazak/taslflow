// Logique frontend minimale pour la gestion des tâches (Fonctionnalité 3)

async function loadProjectTasks(projectId) {
  try {
    // Note: cette route doit correspondre à ce qui a été défini dans le backend.
    // D'après le sujet: GET /api/projects/:id/tasks
    const res = await axios.get(`/projects/${projectId}/tasks`);
    return res.data;
  } catch (err) {
    console.error("Erreur lors du chargement des tâches", err);
  }
}

async function createTask(projectId, taskData) {
  try {
    const res = await axios.post('/tasks', { ...taskData, project: projectId });
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la création", err);
    alert(err.response?.data?.errors?.[0]?.msg || "Erreur de création");
  }
}

async function updateTask(taskId, taskData) {
  try {
    const res = await axios.put(`/tasks/${taskId}`, taskData);
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la modification", err);
    alert(err.response?.data?.errors?.[0]?.msg || "Erreur de modification");
  }
}

async function updateTaskStatus(taskId, newStatus) {
  try {
    const res = await axios.patch(`/tasks/${taskId}/status`, { status: newStatus });
    return res.data;
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut", err);
    alert(err.response?.data?.errors?.[0]?.msg || "Statut invalide");
  }
}

async function deleteTask(taskId) {
  try {
    await axios.delete(`/tasks/${taskId}`);
  } catch (err) {
    console.error("Erreur lors de la suppression", err);
  }
}
