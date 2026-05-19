const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  type: { 
    type: String,
    enum: ['TASK_ASSIGNED', 'STATUS_CHANGED', 'PROJECT_ADDED']
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
