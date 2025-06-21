import axios from "axios";

const api = axios.create({
  baseURL: "https://9110-123-20-245-109.ngrok-free.app/api", // Thay bằng base URL backend của bạn
});

// Interceptor để tự gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Đổi từ 'token' sang 'authToken'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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