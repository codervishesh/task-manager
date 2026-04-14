const TaskModel = require('../models/taskModel');

const getTasks = (req, res, next) => {
  try {
    const tasks = TaskModel.getAll();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = TaskModel.create(title.trim());
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

const updateTask = (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed, title } = req.body;
    
    const updates = {};
    if (completed !== undefined) updates.completed = completed;
    if (title && title.trim() !== '') updates.title = title.trim();

    const updatedTask = TaskModel.update(id, updates);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const { id } = req.params;
    const isDeleted = TaskModel.delete(id);
    if (!isDeleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
