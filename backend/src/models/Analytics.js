const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  chartType: {
    type: String,
    enum: ['bar', 'line', 'pie', 'scatter', 'doughnut', '3d'],
    required: true
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  chartConfig: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  chartData: {
    type: mongoose.Schema.Types.Mixed
  },
  title: String,
  description: String,
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
analyticsSchema.index({ userId: 1, createdAt: -1 });
analyticsSchema.index({ fileId: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
