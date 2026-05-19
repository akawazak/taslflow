const Activity = require('../models/Activity');

const logActivity = async (actionType, projectId, userId, details) => {
  try {
    const activity = new Activity({
      actionType,
      project: projectId,
      user: userId,
      details
    });
    await activity.save();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'activité :", error);
  }
};

module.exports = logActivity;