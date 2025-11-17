"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await api.post("/admin/login", { email, password });

      // 🎯 AQUI SALVA O TOKEN NO LOCALSTORAGE
      localStorage.setItem("adminToken", res.data.token);

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Login Admin</h2>

      <input
        className="w-full mb-2 p-2 border"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full mb-2 p-2 border"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 mt-3"
      >
        Entrar
      </button>
    </div>
  );
}
