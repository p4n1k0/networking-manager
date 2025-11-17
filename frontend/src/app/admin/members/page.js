"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega membros do backend
  const loadMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar membros (token inválido ou sem permissões).");
    } finally {
      setLoading(false);
    }
  };

  // Excluir membro
  const deleteMember = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este membro?")) return;
    try {
      await api.delete(`/members/${id}`);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir membro.");
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  if (loading) return <div className="p-6">Carregando membros...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">👥 Gerenciamento de Membros</h1>

      {members.length === 0 ? (
        <p className="text-gray-600">Nenhum membro encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Nome</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className="border-t">
                  <td className="p-3">{member.name}</td>
                  <td className="p-3">{member.email}</td>
                  <td className="p-3">{member.status || "ativo"}</td>
                  <td className="p-3 flex gap-2">
                    {/* Botão excluir */}
                    <button
                      onClick={() => deleteMember(member._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      ✖ Excluir
                    </button>
                    {/* Opcional: botão editar */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
