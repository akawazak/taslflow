const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth'); // Votre middleware de protection

// GET /api/projects/:id/activities
router.get('/:id/activities', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.id })
      .populate('user', 'fullName email') // Récupère le nom de l'auteur de l'action
      .sort({ createdAt: -1 }); // Tri de la plus récente à la plus ancienne

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique d'activités." });
  }
});

module.exports = router;