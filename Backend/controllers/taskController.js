import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
};

export const createTask = async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};

export const getTaskSummary = async (req, res) => {
  const total = await Task.countDocuments();
  const pending = await Task.countDocuments({ status: 'Pending' });
  const completed = await Task.countDocuments({ status: 'Done' });
  res.json({ total, pending, completed });
};
