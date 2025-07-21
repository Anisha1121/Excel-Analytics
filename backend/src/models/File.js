const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  metadata: {
    sheets: [String],
    columns: [String],
    rowCount: Number,
    sheetData: mongoose.Schema.Types.Mixed
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processingError: String
}, {
  timestamps: true
});

// Index for faster queries
fileSchema.index({ userId: 1, uploadDate: -1 });

module.exports = mongoose.model('File', fileSchema);
