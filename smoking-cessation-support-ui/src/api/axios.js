import axios from "axios";
 
const api = axios.create({
  baseURL: "https://68529cda0594059b23ce588f.mockapi.io/username",
});
 
export default api;