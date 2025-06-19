// lib/axiosInstance.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }, 
});

// Add Authorization header to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-storage");

      // Redirect to login
      window.location.href = "/login"; // Adjust as needed

      return Promise.reject("Unauthorized. Redirecting to login...");
    }

    return Promise.reject(error);
  }
);
