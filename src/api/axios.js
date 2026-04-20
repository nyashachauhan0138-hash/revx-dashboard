import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

// Automatically attach the JWT token to every request
// So you don't have to manually add it in every page
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;