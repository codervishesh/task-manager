const { v4: uuidv4 } = require('uuid');

// In-memory array
let tasks = [];

const TaskModel = {
  getAll: () => tasks,
  
  create: (title) => {
    const newTask = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return newTask;
  },

  update: (id, updates) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return null;
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    return tasks[taskIndex];
  },

  delete: (id) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return false;
    
    tasks.splice(taskIndex, 1);
    return true;
  }
};

module.exports = TaskModel;
