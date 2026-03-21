import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    "Content-Type": "application/json",
  }
});

export const mlModelApiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/predict/',
  headers: {
    "Content-Type": "application/json",
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});