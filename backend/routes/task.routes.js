const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all task routes
router.use(protect);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get task statistics for dashboard
router.get('/stats', taskController.getTaskStats);

// Generate PDF report
router.get('/report', taskController.generatePDFReport);

// Get single task
router.get('/:id', taskController.getTaskById);

// Create new task
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('deadline', 'Valid deadline date is required').isISO8601(),
    check('assignedTo', 'Assigned to field is required').not().isEmpty(),
    check('status').isIn(['Pending', 'In Progress', 'Done']).optional()
  ],
  taskController.createTask
);

// Update task
router.put(
  '/:id',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('deadline', 'Valid deadline date is required').isISO8601(),
    check('assignedTo', 'Assigned to field is required').not().isEmpty(),
    check('status').isIn(['Pending', 'In Progress', 'Done']).not().isEmpty()
  ],
  taskController.updateTask
);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;