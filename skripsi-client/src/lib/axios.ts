import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  // Sesuaikan dengan port BE kamu (3000)
  // baseURL: "http://localhost:3000", 
  baseURL: "https://skripsi-server-production-production.up.railway.app", 
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * INTERCEPTOR REQUEST
 * Menyelipkan token di header secara otomatis
 */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.token = token; 
  }
  return config;
});

/**
 * INTERCEPTOR RESPONSE
 * Menangkap respon dari BE. Jika data kosong (404), kita akali agar tidak dianggap error.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Ambil pesan error dari BE
    const msg = error.response?.data?.message || error.response?.data?.msg || "";
    
    // 2. AKAL-AKALAN: Jika status 404 dan pesannya mengandung kata "kosong",
    // kita anggap sukses dan kirim data array kosong.
    // Ini akan menghilangkan notifikasi "1 Issue" di UI Anda.
    if (error.response?.status === 404 && msg.toLowerCase().includes("kosong")) {
      return Promise.resolve({ data: [] }); 
    }

    // 3. Logika Autentikasi (Token Expired/Invalid)
    if (error.response && (error.response.status === 401 || error.response.status === 500)) {
      if (msg.includes("auth") || msg.includes("invalid") || msg.includes("token")) {
        useAuthStore.getState().logout(); 
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    
    // 4. Jika error jenis lain, tetap lempar ke aplikasi sebagai error
    return Promise.reject(error);
  }
);

export default api;