import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

// Create an Axios instance
const axiosInstance = axios.create({
  // Use relative baseURL so it follows the running frontend port (dev/prod) and hits the Vite proxy.
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add API key to mutation requests
axiosInstance.interceptors.request.use((request) => {
  if (API_KEY && request.method !== 'get') {
    request.headers['X-API-Key'] = API_KEY;
  }
  return request;
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    //console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error("Error response:", error.response);
    return Promise.reject(error);
  },
);

export default axiosInstance;
