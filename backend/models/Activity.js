const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true,
    enum: ['TASK_CREATE', 'TASK_DELETE', 'STATUS_CHANGE', 'MEMBER_ADD', 'MEMBER_REMOVE', 'PROJECT_UPDATE']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  details: {
    type: String,
    required: true
  }
}, { 
  timestamps: true // Génère automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('Activity', activitySchema);