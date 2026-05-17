const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Project = require("../models/Project");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const User = require("../models/User");

// GET 
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

// POST 
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

// GET 
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

// PUT 
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

// DELETE
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
module.exports = router;