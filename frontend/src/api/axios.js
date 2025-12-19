import axios from 'axios';

const API_URL_PRD = import.meta.env.VITE_API_URL;
const API_URL_DEV = 'http://localhost:3000/api';

const baseURL = import.meta.env.DEV ? API_URL_DEV : API_URL_PRD;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;