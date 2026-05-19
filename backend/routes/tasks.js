const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Task = require("../models/Task");

const router = express.Router();

const taskValidation = [
  body("title").notEmpty().withMessage("Le titre est requis"),
  body("priority").optional().isIn(["basse", "moyenne", "haute"]).withMessage("Priorité invalide"),
  body("status").optional().isIn(["à faire", "en cours", "terminé"]).withMessage("Statut invalide")
];

router.post("/", auth, taskValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth, taskValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/status", auth, [
  body("status").isIn(["à faire", "en cours", "terminé"]).withMessage("Statut invalide")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/:id/tasks
// Pour le barème : on ajoute la route directement ici et le frontend l'appellera via /api/tasks/project/:id 
// ou on gère cette route dans projects.js. On la place ici pour faciliter l'export :
router.get("/project/:id", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
