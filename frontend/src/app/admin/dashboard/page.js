"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function AdminDashboard() {

  const [intents, setIntents] = useState([]);
  const [showIntents, setShowIntents] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token aplicado ao axios:", token);
    } else {
      console.log("Token inexistente no localStorage");
    }
  }, []);


  // 🔥 Função para carregar intenções
  const loadIntents = async () => {
    try {
      const res = await api.get("/intents");
      setIntents(res.data);
      setShowIntents(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar intenções (token inválido ou sem permissões).");
    }
  };

  // 🔥 Função para aprovar ou rejeitar
  const updateIntentStatus = async (intentId, status) => {
    try {
      await api.patch(`/intents/${intentId}`, { status });
      loadIntents(); // recarrega
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar intenção.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">🔐 Painel Administrativo</h1>

      <button
        onClick={loadIntents}
        className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 mt-4"
      >
        🔍 Ver Intenções (ADMIN)
      </button>

      {/* Links do menu */}
      <ul className="mt-6 space-y-4">
        <li><a href="/admin/members" className="text-blue-600">Gerenciar Membros</a></li>
        <li><a href="/admin/payments" className="text-blue-600">Gerenciar Pagamentos</a></li>
        <li><a href="/admin/referrals" className="text-blue-600">Gerenciar Indicações</a></li>
        <li><a href="/admin/meetings" className="text-blue-600">Gerenciar Reuniões</a></li>
      </ul>

      {/* Modal */}
      {showIntents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">📌 Intenções Pendentes</h2>

            {intents.length === 0 && (
              <p className="text-gray-600">Nenhuma intenção encontrada.</p>
            )}

            <div className="max-h-96 overflow-y-auto space-y-4">
              {intents.map((intent) => (
                <div
                  key={intent._id}
                  className="border p-4 rounded bg-gray-100 shadow-sm"
                >
                  <p><b>ID:</b> {intent._id}</p>
                  <p><b>Nome:</b> {intent.name}</p>
                  <p><b>Email:</b> {intent.email}</p>
                  <p><b>Status atual:</b> {intent.status}</p>
                  <p><b>Mensagem:</b> {intent.message}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateIntentStatus(intent._id, "approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={intent.status === "approved"}
                    >
                      ✔ Aprovar
                    </button>

                    <button
                      onClick={() => updateIntentStatus(intent._id, "rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={intent.status === "rejected"}
                    >
                      ✖ Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowIntents(false)}
              className="w-full mt-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
