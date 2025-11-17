"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function MemberLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/members/login", { email, password });

      localStorage.setItem("memberToken", res.data.token);
      localStorage.setItem("memberInfo", JSON.stringify(res.data.member));

      router.push("/member/dashboard");
    } catch (err) {
      alert("Email ou senha incorretos");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={login} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Login de Membro</h1>

        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Sua senha"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Entrar
        </button>
      </form>
    </div>
  );
}
