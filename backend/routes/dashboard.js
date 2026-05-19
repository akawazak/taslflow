const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");

// GET /api/dashboard
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Active projects where user is owner or member
    const activeProjects = await Project.countDocuments({
      $or: [{ owner: userId }, { members: userId }],
      status: "actif",
    });

    // Task aggregation for this user
    const taskStats = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: null,
          total: { $count: {} },
          done: { $sum: { $cond: [{ $eq: ["$status", "terminé"] }, 1, 0] } },
          late: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "terminé"] },
                    { $lt: ["$deadline", now] },
                    { $ne: ["$deadline", null] },
                  ],
                },
                1, 0,
              ],
            },
          },
        },
      },
    ]);

    const stats = taskStats[0] || { total: 0, done: 0, late: 0 };

    // In-progress tasks sorted by priority desc then deadline asc
    const priorityOrder = { haute: 0, moyenne: 1, basse: 2 };
    const inProgressTasks = await Task.find({
      assignedTo: userId,
      status: "en cours",
    })
      .populate("project", "title")
      .sort({ deadline: 1 });

    inProgressTasks.sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 2;
      const pb = priorityOrder[b.priority] ?? 2;
      return pa - pb;
    });

    res.json({
      activeProjects,
      assignedTasks: stats.total,
      completedTasks: stats.done,
      lateTasks: stats.late,
      inProgressTasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
