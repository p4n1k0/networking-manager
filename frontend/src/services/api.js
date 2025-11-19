import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

/**
 * 🔐 Interceptor inteligente de autenticação
 * - Prioriza memberToken
 * - Usa adminToken quando necessário
 * - Nunca conflita entre os dois
 */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const memberToken = localStorage.getItem("memberToken");
    const adminToken = localStorage.getItem("adminToken");

    // 🔥 Regra: prioridade para o membro (fluxo principal do app)
    let tokenToUse = memberToken || adminToken;

    // 💡 Se o endpoint for claramente administrativo → força adminToken
    if (
      config.url.startsWith("/admin") ||
      config.url.startsWith("/intents") ||
      config.url.startsWith("/referrals") && config.method === "patch" // ex: alterar status
    ) {
      tokenToUse = adminToken || memberToken;
    }

    if (tokenToUse) {
      config.headers.Authorization = `Bearer ${tokenToUse}`;
    }
  }

  return config;
});

export default api;
