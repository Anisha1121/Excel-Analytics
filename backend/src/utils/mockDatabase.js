// Temporary in-memory database for testing
const users = [];
const files = [];
const analytics = [];

let userCounter = 1;
let fileCounter = 1;
let analyticsCounter = 1;

const mockDatabase = {
  // User operations
  createUser: (userData) => {
    const user = {
      _id: userCounter++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(user);
    return user;
  },

  findUserByEmail: (email) => {
    return users.find(user => user.email === email);
  },

  findUserByUsername: (username) => {
    return users.find(user => user.username === username);
  },

  findUserById: (id) => {
    return users.find(user => user._id == id);
  },

  // File operations
  createFile: (fileData) => {
    const file = {
      _id: fileCounter++,
      ...fileData,
      uploadDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    files.push(file);
    return file;
  },

  findFilesByUserId: (userId) => {
    return files.filter(file => file.userId == userId);
  },

  findFileById: (id) => {
    return files.find(file => file._id == id);
  },

  // Analytics operations
  createAnalytics: (analyticsData) => {
    const analytics_item = {
      _id: analyticsCounter++,
      ...analyticsData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    analytics.push(analytics_item);
    return analytics_item;
  },

  // Stats
  getUserCount: () => users.length,
  getFileCount: () => files.length,
  getAnalyticsCount: () => analytics.length
};

module.exports = mockDatabase;
