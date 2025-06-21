import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "https://6f08-123-20-245-109.ngrok-free.app/api", // Thay bằng base URL backend của bạn
=======
  baseURL: "https://9110-123-20-245-109.ngrok-free.app/api", // Thay bằng base URL backend của bạn
>>>>>>> b0540da51f0a95b6b15541f0e4d0615d3697e7b3
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