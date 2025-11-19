import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const memberToken = localStorage.getItem("memberToken");
    const adminToken = localStorage.getItem("adminToken");

    let tokenToUse = memberToken; // padrão seguro

    const isAdminRoute =
      config.url.startsWith("/admin") ||
      config.url.startsWith("/intents") ||
      (
        config.url === "/referrals" && config.method === "get" // lista geral
      ) ||
      (
        config.url.includes("/referrals/") &&
        config.method === "patch" // alterar status ou valor
      );

    // 🔐 Se a rota for administrativa → força adminToken
    if (isAdminRoute) {
      tokenToUse = adminToken;
    }

    // 🔐 Rota do membro: /referrals/member/me → nunca usar adminToken
    if (config.url.startsWith("/referrals/member")) {
      tokenToUse = memberToken;
    }

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }
  }

  return config;
});

export default api;
