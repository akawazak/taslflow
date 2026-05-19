const Notification = require('../models/Notification');

const createNotification = async (userId, message, type) => {
  try {
    await Notification.create({
      user: userId,
      message,
      type
    });
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
  }
};

module.exports = createNotification;