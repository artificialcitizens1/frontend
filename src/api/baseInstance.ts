import axios from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Base URL - you can set this to your API endpoint
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://13.201.10.152/";

// Create axios instance
const baseInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 minutes timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
baseInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log("🚀 Request:", config);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
baseInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log("✅ Response:", response);
    }

    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("authToken");
          window.location.href = "/login";
          break;
        case 403:
          console.error("❌ Forbidden: You do not have permission to access this resource");
          break;
        case 404:
          console.error("❌ Not Found: The requested resource was not found");
          break;
        case 500:
          console.error("❌ Server Error: Internal server error occurred");
          break;
        default:
          console.error(`❌ Error ${status}:`, data?.message || "An error occurred");
      }
    } else if (error.request) {
      console.error("❌ Network Error: No response received from server");
    } else {
      console.error("❌ Request Setup Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default baseInstance;
