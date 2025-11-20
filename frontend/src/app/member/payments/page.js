"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export default function AdminPaymentsPage() {
  const [memberId, setMemberId] = useState("");

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["adminPayments", memberId],
    queryFn: async () => {
      const res = await api.get("/payments", {
        params: memberId ? { memberId } : {},
      });
      return res.data;
    },
  });

  const deletePayment = async (id) => {
    if (!confirm("Remover pagamento?")) return;
    await api.delete(`/payments/${id}`);
    refetch();
  };

  const updatePayment = async (id, status) => {
    await api.patch(`/payments/${id}`, { status });
    refetch();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">💰 Ver Pagamentos</h1>

      {/* FILTRO */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
        <input
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          placeholder="Filtrar por ID do Membro"
          className="border px-3 py-2 rounded-md w-80"
        />
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Buscar
        </button>
      </div>

      {/* LISTAGEM */}
      {isLoading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="text-red-600">Erro ao carregar pagamentos.</p>
      ) : data.length === 0 ? (
        <p>Nenhum pagamento encontrado.</p>
      ) : (
        <div className="space-y-4">
          {data.map((pay) => (
            <div
              key={pay._id}
              className="p-4 border rounded-lg bg-white shadow"
            >
              <p>
                <strong>Membro:</strong> {pay.member?.name} ({pay.member?.email})
              </p>

              <p>
                <strong>Valor:</strong> R$ {pay.amount.toFixed(2)}
              </p>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
