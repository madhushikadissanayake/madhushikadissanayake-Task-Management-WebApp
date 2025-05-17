const Task = require('../models/task.model');
const PDFDocument = require('pdfkit');
const { validationResult } = require('express-validator');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    // Build query based on search parameters
    const query = {};
    
    // Search by title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { assignedTo: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filter by status
    if (req.query.status && ['Pending', 'In Progress', 'Done'].includes(req.query.status)) {
      query.status = req.query.status;
    }
    
    // Query tasks created by current user
    query.createdBy = req.user._id;
    
    // Sort options
    const sortOptions = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy === 'deadline' ? 'deadline' : 'title';
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortOptions[sortField] = sortOrder;
    } else {
      // Default sort by createdAt date
      sortOptions.createdAt = -1;
    }
    
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check if task belongs to user
    if (task.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Create new task
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      assignedTo: req.body.assignedTo,
      status: req.body.status || 'Pending',
      createdBy: req.user._id
    });
    
    // Save task to database
    await task.save();
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    // Find task by ID
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check if task belongs to user
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }
    
    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        assignedTo: req.body.assignedTo,
        status: req.body.status
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    // Find task by ID
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check if task belongs to user
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }
    
    // Delete task
    await Task.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// Generate PDF report of tasks
exports.generatePDFReport = async (req, res) => {
  try {
    // Build query based on filters
    const query = { createdBy: req.user._id };
    
    if (req.query.status && ['Pending', 'In Progress', 'Done'].includes(req.query.status)) {
      query.status = req.query.status;
    }
    
    // Get tasks
    const tasks = await Task.find(query).sort({ deadline: 1 });
    
    // Create PDF document
    const doc = new PDFDocument();
    
    // Set PDF response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=tasks-report-${Date.now()}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(20).text('Task Management System - Tasks Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`User: ${req.user.name} (${req.user.email})`, { align: 'center' });
    doc.moveDown();
    doc.moveDown();
    
    // Add task count
    doc.fontSize(14).text(`Total Tasks: ${tasks.length}`, { underline: true });
    doc.moveDown();
    
    // Add tasks to PDF
    tasks.forEach((task, index) => {
      // Add spacing between tasks
      if (index > 0) doc.moveDown();
      
      // Task details
      doc.fontSize(14).text(`Task ${index + 1}: ${task.title}`);
      doc.fontSize(10).text(`Description: ${task.description}`);
      doc.fontSize(10).text(`Assigned To: ${task.assignedTo}`);
      doc.fontSize(10).text(`Status: ${task.status}`);
      doc.fontSize(10).text(`Deadline: ${new Date(task.deadline).toLocaleDateString()}`);
      doc.fontSize(10).text(`Created: ${new Date(task.createdAt).toLocaleDateString()}`);
      
      // Add line between tasks
      if (index < tasks.length - 1) {
        doc.moveDown(0.5);
        doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      }
    });
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report',
      error: error.message
    });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    // Get counts by status
    const [pendingCount, inProgressCount, doneCount] = await Promise.all([
      Task.countDocuments({ createdBy: req.user._id, status: 'Pending' }),
      Task.countDocuments({ createdBy: req.user._id, status: 'In Progress' }),
      Task.countDocuments({ createdBy: req.user._id, status: 'Done' })
    ]);
    
    // Get upcoming deadlines (tasks due in the next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingDeadlines = await Task.find({
      createdBy: req.user._id,
      status: { $ne: 'Done' },
      deadline: { $gte: today, $lte: nextWeek }
    }).sort({ deadline: 1 }).limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        total: pendingCount + inProgressCount + doneCount,
        pending: pendingCount,
        inProgress: inProgressCount,
        done: doneCount,
        upcomingDeadlines
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task statistics',
      error: error.message
    });
  }
};