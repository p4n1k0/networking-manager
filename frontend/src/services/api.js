import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const memberToken = localStorage.getItem("memberToken");
    const adminToken = localStorage.getItem("adminToken");

    let tokenToUse = memberToken; // padrão: membro

    // Rotas 100% de admin → começam com /admin
    if (config.url.startsWith("/admin")) {
      tokenToUse = adminToken || memberToken;
    }

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }
  }

  return config;
});

export default api;
