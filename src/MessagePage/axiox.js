import axios from "axios";

const instance = axios.create({
  baseURL: "https://rolling-api.vercel.app/20-4", // 공통 base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 (토큰 자동 포함)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 저장된 토큰
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;
