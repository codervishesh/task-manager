import axios from 'axios';

// Use environment variable if deployed, otherwise fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/tasks';

export const fetchTasks = () => axios.get(API_URL);
export const createTask = (title) => axios.post(API_URL, { title });
export const updateTask = (id, updates) => axios.patch(`${API_URL}/${id}`, updates);
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
