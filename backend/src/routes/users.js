const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { username, email } = req.body;
    const User = require('../models/User');
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user analytics
router.get('/analytics', async (req, res) => {
  try {
    const Analytics = require('../models/Analytics');
    const File = require('../models/File');
    
    const analytics = await Analytics.find({ userId: req.user._id })
      .populate('fileId', 'originalName uploadDate')
      .sort({ createdAt: -1 })
      .limit(20);

    const fileCount = await File.countDocuments({ 
      userId: req.user._id, 
      isProcessed: true 
    });
    
    const chartCount = await Analytics.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        analytics,
        stats: {
          totalFiles: fileCount,
          totalCharts: chartCount
        }
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
