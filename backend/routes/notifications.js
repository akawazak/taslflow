const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// GET /api/notifications - Récupérer les notifications NON LUES de l'utilisateur connecté
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id, isRead: false })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PATCH /api/notifications/:id/read - Marquer une notification comme lue
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;