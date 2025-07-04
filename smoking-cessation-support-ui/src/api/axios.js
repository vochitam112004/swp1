import axios from "axios";

const api = axios.create({
<<<<<<< HEAD

  baseURL: "https://72bb-113-173-227-8.ngrok-free.app/api",// Thay bằng base URL backend của bạn

=======
  baseURL: "https://29a9-118-69-182-144.ngrok-free.app/api",// Thay bằng base URL backend của bạn
>>>>>>> b746edb46675697473469445944e65916536e9be
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