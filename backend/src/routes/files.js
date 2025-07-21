const express = require('express');
const {
  uploadFile,
  getFiles,
  getFileData,
  deleteFile,
  generateChart
} = require('../controllers/fileController');
const { auth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Routes
router.post('/upload', upload.single('file'), handleUploadError, uploadFile);
router.get('/', getFiles);
router.get('/:id', getFileData);
router.delete('/:id', deleteFile);
router.post('/:id/analyze', generateChart);

module.exports = router;
