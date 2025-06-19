import axios from "axios";
 
const api = axios.create({
  baseURL: "https://1c6a-118-69-182-144.ngrok-free.app/api",
});
 
export default api;