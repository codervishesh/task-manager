import React, { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './services/api';
import './App.css';

// --- Premium SVG Icons ---
const PlusIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const AlertIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InboxIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const CheckIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

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
      setError('Cannot connect to the server. Please check if your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (title) => {
    try {
      setError(null);
      const res = await createTask(title);
      setTasks([res.data, ...tasks]); 
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
    <div className="app-wrapper">
      <header className="header">
        <div className="header-text">
          <h1>Productivity</h1>
          <p>Organize your work and life.</p>
        </div>
        <span className="badge">Production</span>
      </header>

      {error && (
        <div className="error-banner">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}
      
      <TaskForm onSubmit={handleCreate} />
      
      <div className="filters">
        {['All', 'Pending', 'Completed'].map(f => (
          <button 
            key={f} 
            className={filter === f ? 'active' : ''} 
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Syncing data...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <InboxIcon />
          <h3>You're all caught up!</h3>
          <p>You have no tasks here. Add a new one to get started.</p>
        </div>
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
        placeholder="What's next on your agenda?" 
        disabled={submitting}
        autoFocus
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        <PlusIcon /> {submitting ? 'Adding...' : 'Create'}
      </button>
    </form>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    await onDelete(task.id);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content" onClick={() => onToggle(task.id, task.completed)}>
        <div className={`circle-check ${task.completed ? 'checked' : ''}`}>
          <CheckIcon />
        </div>
        <span>{task.title}</span>
      </div>
      <div className="task-actions">
        <button onClick={handleDelete} disabled={isDeleting} title="Remove task">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

export default App;
