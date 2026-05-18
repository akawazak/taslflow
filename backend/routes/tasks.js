const logActivity = require('../middleware/activityLogger');

// ... À l'intérieur de votre route PATCH /api/tasks/:id/status après la sauvegarde réussie :
await logActivity(
  'STATUS_CHANGE',
  task.project,       // L'ID du projet lié à la tâche
  req.user.id,        // Récupéré depuis votre middleware d'authentification auth.js
  `a changé le statut de la tâche "${task.title}" à "${newStatus}"`
);