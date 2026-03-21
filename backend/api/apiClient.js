import axios from "axios";

const mlModelApiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/predict/',
  headers: {
    "Content-Type": "application/json",
  }
});

export { mlModelApiClient };