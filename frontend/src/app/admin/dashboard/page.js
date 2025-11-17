"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalReferrals: 0,
    totalObrigados: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Aplica token admin
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    loadStats();
  }, []);

  // 🔥 Função para carregar indicadores
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const membersRes = await api.get("/members");
      const referralsRes = await api.get("/referrals?month=current");
      setStats({
        totalMembers: membersRes.data.length,
        totalReferrals: referralsRes.data.length,
        totalObrigados: 32,
      });
      
      // const obrigadosRes = await api.get("/obrigados?month=current");
      // setStats({  
      //   totalObrigados: obrigadosRes.data.length,
      // });

    } catch (err) {
      console.error(err);
      alert("Erro ao carregar indicadores.");
    } finally {
      setLoadingStats(false);
    }
  };


  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🔐 Painel Administrativo</h1>

      {/* 🔹 Indicadores */}
      {loadingStats ? (
        <p>Carregando indicadores...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-gray-600 mb-2">Membros Ativos</h2>
            <p className="text-3xl font-bold text-green-600">{stats.totalMembers}</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-gray-600 mb-2">Indicações no mês</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalReferrals}</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-gray-600 mb-2"> `Obrigados` no mês</h2>
            <p className="text-3xl font-bold text-purple-600">{stats.totalObrigados}</p>
          </div>
        </div>
      )}

      {/* Links do menu */}
      <ul className="mt-6 space-y-4">
        <li>
          <Link
            href="/admin/intents"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
          >
            📌 Gerenciar Intenções
          </Link>
        </li>
        <li>
          <Link
            href="/admin/members"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
          >
            👥 Gerenciar Membros
          </Link>
        </li>
        <li>
          <Link
            href="/admin/payments"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
          >
            💳 Gerenciar Pagamentos
          </Link>
        </li>
        <li>
          <Link
            href="/admin/referrals"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
          >
            📈 Gerenciar Indicações
          </Link>
        </li>
        <li>
          <Link
            href="/admin/meetings"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
          >
            🗓 Gerenciar Reuniões
          </Link>
        </li>
      </ul>
    </div>
  );
}
