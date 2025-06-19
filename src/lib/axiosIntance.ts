import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://api.grandfitness.com.uz",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add Authorization header to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error); // Add logging for debugging

    // Handle network errors
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("Network Error: Unable to connect to the server");
      return Promise.reject({
        ...error,
        message: "Network error. Please check your connection.",
      });
    }

    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
      return Promise.reject({
        ...error,
        message: "Session expired. Please login again.",
      });
    }

    return Promise.reject(error);
  }
);
