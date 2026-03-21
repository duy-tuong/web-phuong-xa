import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "", // dán URL backend vào đây, ví dụ: "http://localhost:8080/api"
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
