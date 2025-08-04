  import axios from "axios";


  export const baseApiUrl = "https://3d455987a5f1.ngrok-free.app" // dùng để up ảnh từ máy

  const api = axios.create({

    baseURL: "https://3d455987a5f1.ngrok-free.app/api", // Thay bằng base URL backend của bạn
    headers: {
      "Content-Type": "application/json"
    }
  });

  api.interceptors.request.use((config) => {
    config.headers["ngrok-skip-browser-warning"] = "true";
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found");
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