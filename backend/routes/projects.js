
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
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Project = require("../models/Project");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const User = require("../models/User");

// GET /api/projects — list with pagination
router.get("/", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    };

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate("owner", "fullName email")
        .populate("members", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(query),
    ]);

    res.json({ data: projects, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = await Project.create({
      title, description, deadline,
      owner: req.user._id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "fullName email")
      .populate("members", "fullName email");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember =
      project.owner._id.toString() === req.user._id.toString() ||
      project.members.some((m) => m._id.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: "Access denied" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/projects/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only owner can edit" });

    const { title, description, deadline, status } = req.body;
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (deadline !== undefined) project.deadline = deadline;
    if (status) project.status = status;
    await project.save();

    await Activity.create({
      type: "project_updated", project: project._id, user: req.user._id,
      details: `${req.user.fullName} a modifié le projet "${project.title}"`,
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only owner can delete" });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects/:id/members — invite by email
router.post("/:id/members", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only owner can invite" });

    const { email } = req.body;
    const newMember = await User.findOne({ email });
    if (!newMember) return res.status(404).json({ message: "User not found" });

    if (
      project.owner.toString() === newMember._id.toString() ||
      project.members.includes(newMember._id)
    ) {
      return res.status(400).json({ message: "User already in project" });
    }

    project.members.push(newMember._id);
    await project.save();

    await Activity.create({
      type: "member_added", project: project._id, user: req.user._id,
      details: `${req.user.fullName} a ajouté ${newMember.fullName}`,
    });

    await Notification.create({
      user: newMember._id, type: "member_added",
      message: `Vous avez été ajouté au projet "${project.title}"`,
    });

    res.json({ message: "Member added", member: { id: newMember._id, fullName: newMember.fullName, email: newMember.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/projects/:id/members/:userId
router.delete("/:id/members/:userId", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only owner can remove members" });

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await project.save();

    await Activity.create({
      type: "member_removed", project: project._id, user: req.user._id,
      details: `${req.user.fullName} a retiré un membre`,
    });

    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/:id/activities
router.get("/:id/activities", auth, async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.id })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
