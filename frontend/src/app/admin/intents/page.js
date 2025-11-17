"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function AdminIntentsPage() {
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Aplica token admin
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    loadIntents();
  }, []);

  // 🔹 Carrega intenções
  const loadIntents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/intents");
      setIntents(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar intenções.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Aprovar ou rejeitar intenção
  const updateIntentStatus = async (intentId, status) => {
    try {
      await api.patch(`/intents/${intentId}/status`, { status });
      loadIntents();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar intenção.");
    }
  };

  if (loading) return <div className="p-6">Carregando intenções...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📌 Gerenciar Intenções</h1>

      {intents.length === 0 ? (
        <p>Nenhuma intenção encontrada.</p>
      ) : (
        <div className="space-y-4">
          {intents.map((intent) => (
            <div
              key={intent._id}
              className="border p-4 rounded bg-gray-50 shadow-sm"
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
      )}
    </div>
  );
}
