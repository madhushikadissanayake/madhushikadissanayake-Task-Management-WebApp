import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskSummary,
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.get('/summary', getTaskSummary);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
