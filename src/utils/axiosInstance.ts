import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5173/api', // Update the baseURL if needed
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(request => {
  //console.log('Starting Request', request);
  return request;
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    //console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Error response:', error.response);
    return Promise.reject(error);
  }
);

export default axiosInstance;
