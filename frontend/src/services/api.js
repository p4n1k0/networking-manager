import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const memberToken = localStorage.getItem("memberToken");
    const adminToken = localStorage.getItem("adminToken");

    let tokenToUse = memberToken; // padrão = membro

    // 🔐 1. Rotas ADMIN obrigam adminToken
    const adminRoutes = [
      "/admin",
      "/intents",
      "/members",        // rotas administrativas
      "/referrals",      // lista completa ou alterar status
    ];

    // Se a rota é 100% administrativa, força adminToken
    if (adminRoutes.some((r) => config.url.startsWith(r))) {
      tokenToUse = adminToken || memberToken;
    }

    // 🔥 2. PATCH /referrals/:id/status → precisa ser admin
    if (config.url.includes("/referrals/") && config.method === "patch") {
      tokenToUse = adminToken || memberToken;
    }

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }
  }

  return config;
});

export default api;
