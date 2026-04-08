import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:1337/api",
});

axiosClient.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default axiosClient;