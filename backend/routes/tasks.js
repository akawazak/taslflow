const logActivity = require('../middleware/activityLogger');

// ... À l'intérieur de votre route PATCH /api/tasks/:id/status après la sauvegarde réussie :
await logActivity(
  'STATUS_CHANGE',
  task.project,       // L'ID du projet lié à la tâche
  req.user.id,        // Récupéré depuis votre middleware d'authentification auth.js
  `a changé le statut de la tâche "${task.title}" à "${newStatus}"`
);
router.get("/projects/:id/tasks", auth, async (req, res) => {

    const {
        status,
        priority,
        assignedTo,
        search,
        page = 1,
        limit = 5
    } = req.query;

    let filter = {
        project: req.params.id
    };

    // Filtre statut
    if(status) {
        filter.status = status;
    }

    // Filtre priorité
    if(priority) {
        filter.priority = priority;
    }

    // Filtre membre
    if(assignedTo) {
        filter.assignedTo = assignedTo;
    }

    // Recherche
    if(search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({
        data: tasks,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
    });
});
