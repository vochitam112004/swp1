import axios from "axios";
 
const api = axios.create({
  baseURL: "https://7d98-118-69-182-149.ngrok-free.app/api/",
});
 
export default api;