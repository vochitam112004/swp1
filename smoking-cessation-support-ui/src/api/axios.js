import axios from "axios";
 
const api = axios.create({
  baseURL: "https://a92c-118-69-70-166.ngrok-free.app/api",
});
 
export default api;