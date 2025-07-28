  import axios from "axios";

  export const baseApiUrl = "https://5c56b9209fa0.ngrok-free.app" // dùng để up ảnh từ máy

  const api = axios.create({

    baseURL: "https://5c56b9209fa0.ngrok-free.app/api", // Thay bằng base URL backend của bạn
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Interceptor để tự gắn token vào header
  api.interceptors.request.use((config) => {
    config.headers["ngrok-skip-browser-warning"] = "true";
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token attached:", token); // DEBUG
    } else {
      console.warn("⚠️ No token found");
    }
    //
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
      }
      return Promise.reject(error);
    }
  );

  export default api;