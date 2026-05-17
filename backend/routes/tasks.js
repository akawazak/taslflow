const express = require("express");

const auth = require("../middleware/auth");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate("assignedTo", "fullName email")
      .sort({ createdAt: -1 });

    return res.json({ data: tasks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/assign", auth, async (req, res) => {
  try {
    const { memberId } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: memberId || null },
      { new: true }
    ).populate("assignedTo", "fullName email");

    if (!task) {
      return res.status(404).json({ message: "Tache introuvable" });
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
