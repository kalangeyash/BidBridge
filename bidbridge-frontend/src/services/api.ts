import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Automatically add JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (Unauthorized) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Force login if token expires
    }
    return Promise.reject(error);
  }
);

export default api;