import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const memberToken = localStorage.getItem("memberToken");
  const adminToken = localStorage.getItem("adminToken");

  let tokenToUse = null;

  // 🔹 Rotas administrativas → somente admin
  const adminRoutes = ["/admin", "/intents", "/members"];

  if (adminRoutes.some((r) => config.url.startsWith(r))) {
    tokenToUse = adminToken;
    if (!tokenToUse) console.warn("Rota administrativa sem adminToken!");
  }
  // 🔹 Rotas de membro → somente memberToken
  else if (config.url.startsWith("/payments/me") || config.url.startsWith("/meetings/me") || config.url.startsWith("/referrals/me")) {
    tokenToUse = memberToken;
    if (!tokenToUse) console.warn("Rota de membro sem memberToken!");
  }
  // 🔹 Outras rotas → usa memberToken ou adminToken se existir
  else {
    tokenToUse = memberToken || adminToken;
  }

  if (tokenToUse) {
    config.headers.Authorization = `Bearer ${tokenToUse}`;
  }

  return config;
});

export default api;
