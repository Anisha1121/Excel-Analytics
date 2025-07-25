const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  resetPasswordCode: String,
  resetPasswordCodeExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset code
userSchema.methods.generatePasswordResetCode = function() {
  // Generate 6-digit reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the reset code before saving
  this.resetPasswordCode = crypto.createHash('sha256').update(resetCode).digest('hex');
  
  // Set expire time to 15 minutes from now
  this.resetPasswordCodeExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  
  return resetCode;
};

// Verify password reset code
userSchema.methods.verifyPasswordResetCode = function(inputCode) {
  if (!this.resetPasswordCode || !this.resetPasswordCodeExpire) {
    return false;
  }
  
  // Check if code has expired
  if (Date.now() > this.resetPasswordCodeExpire) {
    return false;
  }
  
  // Hash the input code and compare
  const hashedInputCode = crypto.createHash('sha256').update(inputCode).digest('hex');
  return hashedInputCode === this.resetPasswordCode;
};

// Clear password reset fields
userSchema.methods.clearPasswordReset = function() {
  this.resetPasswordCode = undefined;
  this.resetPasswordCodeExpire = undefined;
  this.resetPasswordToken = undefined;
  this.resetPasswordExpire = undefined;
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.resetPasswordCode;
  delete userObject.resetPasswordCodeExpire;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
