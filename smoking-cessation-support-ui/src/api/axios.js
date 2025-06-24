import axios from "axios";

const api = axios.create({
  baseURL: "https://d4ff-2402-9d80-c23-9008-b570-e9d7-6e26-5d6a.ngrok-free.app/api", // Thay bằng base URL backend của bạn
});

// Interceptor để tự gắn token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔐 Token attached:", token); // DEBUG
  } else {
    console.warn("⚠️ No token found");
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      // Optional: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;