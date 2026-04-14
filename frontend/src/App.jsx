import React, { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchTasks();
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (title) => {
    try {
      setError(null);
      const res = await createTask(title);
      setTasks([...tasks, res.data]);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create task');
      throw err;
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      setError(null);
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
      await updateTask(id, { completed: !currentStatus });
    } catch (err) {
      setError('Failed to update task');
      loadTasks();
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      setTasks(tasks.filter(t => t.id !== id));
      await deleteTask(id);
    } catch (err) {
      setError('Failed to delete task');
      loadTasks();
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Completed') return t.completed;
    if (filter === 'Pending') return !t.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Task Manager</h1>
      {error && <div className="error">{error}</div>}
      
      <TaskForm onSubmit={handleCreate} />
      
      <div className="filters">
        {['All', 'Pending', 'Completed'].map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="empty">No tasks found.</p>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={handleToggle} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setSubmitting(true);
    try {
      await onSubmit(title);
      setTitle('');
    } catch (err) {} finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        placeholder="Add a new task..." 
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? '...' : 'Add'}
      </button>
    </form>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => onToggle(task.id, task.completed)} 
        />
        <span>{task.title}</span>
      </div>
      <div className="task-actions">
        <button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default App;
