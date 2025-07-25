const XLSX = require('xlsx');
const File = require('../models/File');
const Analytics = require('../models/Analytics');
const fs = require('fs').promises;
const path = require('path');

// Upload and process Excel file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { filename, originalname, size, mimetype, path: filePath } = req.file;

    try {
      // Read and parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetNames = workbook.SheetNames;
      
      // Get data from all sheets
      const sheetsData = {};
      const allColumns = new Set();
      let totalRows = 0;

      sheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          headers.forEach(header => {
            if (header) allColumns.add(header.toString());
          });
          
          sheetsData[sheetName] = {
            headers,
            data: rows,
            rowCount: rows.length
          };
          
          totalRows += rows.length;
        }
      });

      // Create file record
      const fileRecord = new File({
        userId: req.user._id,
        filename,
        originalName: originalname,
        size,
        mimetype,
        path: filePath,
        data: sheetsData,
        metadata: {
          sheets: sheetNames,
          columns: Array.from(allColumns),
          rowCount: totalRows,
          sheetData: Object.keys(sheetsData).reduce((acc, sheetName) => {
            acc[sheetName] = {
              rowCount: sheetsData[sheetName].rowCount,
              headers: sheetsData[sheetName].headers
            };
            return acc;
          }, {})
        },
        isProcessed: true
      });

      await fileRecord.save();

      // Return success response with file data
      res.status(201).json({
        success: true,
        message: 'File uploaded and processed successfully',
        file: {
          _id: fileRecord._id,
          originalName: fileRecord.originalName,
          size: fileRecord.size,
          uploadDate: fileRecord.uploadDate,
          metadata: fileRecord.metadata
        }
      });

    } catch (processingError) {
      // Save file record with error
      const fileRecord = new File({
        userId: req.user._id,
        filename,
        originalName: originalname,
        size,
        mimetype,
        path: filePath,
        data: {},
        isProcessed: false,
        processingError: processingError.message
      });

      await fileRecord.save();

      res.status(400).json({
        success: false,
        message: 'Failed to process Excel file',
        error: processingError.message
      });
    }

  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload'
    });
  }
};

// Get user's files
const getFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const files = await File.find({ 
      userId: req.user._id,
      isProcessed: true 
    })
    .select('-data -path')
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(limit);

    const total = await File.countDocuments({ 
      userId: req.user._id,
      isProcessed: true 
    });

    res.json({
      success: true,
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get specific file data
const getFileData = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ 
      _id: id, 
      userId: req.user._id,
      isProcessed: true 
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get preview data (first 10 rows from first sheet)
    const sheetNames = Object.keys(file.data);
    let preview = [];
    let columns = [];

    if (sheetNames.length > 0) {
      const firstSheet = file.data[sheetNames[0]];
      if (firstSheet && firstSheet.headers && firstSheet.data) {
        columns = firstSheet.headers.filter(h => h);
        preview = firstSheet.data.slice(0, 10).map(row => {
          const obj = {};
          firstSheet.headers.forEach((header, index) => {
            if (header) {
              obj[header] = row[index] || '';
            }
          });
          return obj;
        });
      }
    }

    res.json({
      success: true,
      data: {
        _id: file._id,
        originalName: file.originalName,
        uploadDate: file.uploadDate,
        metadata: file.metadata,
        columns,
        preview,
        sheets: sheetNames
      }
    });
  } catch (error) {
    console.error('Get file data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, userId: req.user._id });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete physical file
    try {
      await fs.unlink(file.path);
    } catch (fsError) {
      console.warn('Could not delete physical file:', fsError.message);
    }

    // Delete related analytics
    await Analytics.deleteMany({ fileId: file._id });

    // Delete file record
    await File.findByIdAndDelete(file._id);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Generate chart from file data
const generateChart = async (req, res) => {
  try {
    const { id } = req.params;
    const { xAxis, yAxis, chartType, title, description } = req.body;

    // Validate input
    if (!xAxis || !yAxis || !chartType) {
      return res.status(400).json({
        success: false,
        message: 'xAxis, yAxis, and chartType are required'
      });
    }

    const file = await File.findOne({ 
      _id: id, 
      userId: req.user._id,
      isProcessed: true 
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Process chart data (simplified for now)
    const chartConfig = {
      type: chartType,
      xAxis,
      yAxis,
      title: title || `${yAxis} vs ${xAxis}`,
      description: description || ''
    };

    // Create analytics record
    const analytics = new Analytics({
      userId: req.user._id,
      fileId: file._id,
      chartType,
      xAxis,
      yAxis,
      chartConfig,
      title: chartConfig.title,
      description: chartConfig.description
    });

    await analytics.save();

    res.json({
      success: true,
      message: 'Chart generated successfully',
      analytics: {
        _id: analytics._id,
        chartConfig,
        createdAt: analytics.createdAt
      }
    });
  } catch (error) {
    console.error('Generate chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Save chart manually (for manual save button)
const saveChart = async (req, res) => {
  try {
    const { id } = req.params;
    const { xAxis, yAxis, chartType, title, description, chartData } = req.body;

    // Validate input
    if (!xAxis || !yAxis || !chartType) {
      return res.status(400).json({
        success: false,
        message: 'xAxis, yAxis, and chartType are required'
      });
    }

    const file = await File.findOne({ 
      _id: id, 
      userId: req.user._id,
      isProcessed: true 
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if a similar chart already exists
    const existingChart = await Analytics.findOne({
      userId: req.user._id,
      fileId: file._id,
      chartType,
      xAxis,
      yAxis
    });

    if (existingChart) {
      // Update existing chart
      existingChart.title = title || `${yAxis} vs ${xAxis}`;
      existingChart.description = description || '';
      existingChart.chartConfig = {
        type: chartType,
        xAxis,
        yAxis,
        title: existingChart.title,
        description: existingChart.description,
        chartData: chartData || null
      };
      existingChart.updatedAt = new Date();
      
      await existingChart.save();

      res.json({
        success: true,
        message: 'Chart updated successfully',
        analytics: {
          _id: existingChart._id,
          chartConfig: existingChart.chartConfig,
          createdAt: existingChart.createdAt,
          updatedAt: existingChart.updatedAt
        }
      });
    } else {
      // Create new chart
      const chartConfig = {
        type: chartType,
        xAxis,
        yAxis,
        title: title || `${yAxis} vs ${xAxis}`,
        description: description || '',
        chartData: chartData || null
      };

      const analytics = new Analytics({
        userId: req.user._id,
        fileId: file._id,
        chartType,
        xAxis,
        yAxis,
        chartConfig,
        title: chartConfig.title,
        description: chartConfig.description
      });

      await analytics.save();

      res.json({
        success: true,
        message: 'Chart saved successfully',
        analytics: {
          _id: analytics._id,
          chartConfig,
          createdAt: analytics.createdAt
        }
      });
    }
  } catch (error) {
    console.error('Save chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  getFileData,
  deleteFile,
  generateChart,
  saveChart
};
