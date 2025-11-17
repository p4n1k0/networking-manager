"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verifica token admin e aplica no axios
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/members"; // redireciona se não logado
      return;
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    loadMembers();
  }, []);

  // 🔹 Função para carregar membros
  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar membros (token inválido ou sem permissões).");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Remover membro
  const deleteMember = async (memberId) => {
    if (!confirm("Tem certeza que deseja remover este membro?")) return;
    try {
      await api.delete(`/members/${memberId}`);
      loadMembers(); // recarrega lista
    } catch (err) {
      console.error(err);
      alert("Erro ao remover membro.");
    }
  };

  if (loading) return <div className="p-6">Carregando membros...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👥 Gerenciamento de Membros</h1>

      {members.length === 0 && <p>Nenhum membro encontrado.</p>}

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member._id} className="border p-4 rounded bg-gray-50 shadow-sm">
            <p><b>Nome:</b> {member.name}</p>
            <p><b>Email:</b> {member.email}</p>
            <p><b>Telefone:</b> {member.phone}</p>
            <p><b>Negócio:</b> {member.business}</p>
            <p><b>Role:</b> {member.role}</p>
            <p><b>Status:</b> {member.status}</p>

            <button
              onClick={() => deleteMember(member._id)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              🗑 Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
