import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api",
  withCredentials: true, // sends httpOnly cookie automatically
  headers: { "Content-Type": "application/json" },
});

// redirect to login on 401 Unauthorized response
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "login";
    }
    return Promise.reject(error);
  },
);
