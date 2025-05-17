import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
  // Add the Google login method
  loginWithGoogle: () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
    // Return a placeholder promise since we're redirecting
    return Promise.resolve({ redirecting: true });
  },
};

// Tasks API
export const tasksAPI = {
  getAllTasks: (params = {}) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTaskStats: () => api.get('/tasks/stats'),
  generatePDFReport: (params = {}) => {
    window.open(`${API_URL}/tasks/report${formatQueryParams(params)}`, '_blank');
  },
};

// Helper to format query parameters
const formatQueryParams = (params) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// ✅ Export `api` both ways
export { api };
export default api;