import axios from 'axios';

const backendApiClient = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('token')}`,
  }
});

const mlModelApiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/predict/',
  headers: {
    "Content-Type": "application/json",
  }
});

export default { backendApiClient, mlModelApiClient };
