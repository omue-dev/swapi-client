import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  // Use relative baseURL so it follows the running frontend port (dev/prod) and hits the Vite proxy.
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use((request) => {
  //console.log('Starting Request', request);
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
