"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { formatCurrency } from "@/utils/formatCurrency";

export default function PaymentList({ memberId }) {
  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ["payments", memberId],
    queryFn: async () => {
      const res = await api.get(`/payments${memberId ? `?memberId=${memberId}` : ""}`);
      return res.data.items || res.data;
    },
  });

  if (isLoading) return <p>Carregando pagamentos...</p>;
  if (error) return <p>Erro ao carregar pagamentos.</p>;

  return (
    <div className="bg-white p-4 rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Pagamentos Registrados</h3>

      {payments.length === 0 ? (
        <p className="text-gray-500">Nenhum pagamento encontrado.</p>
      ) : (
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Descrição</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Valor</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-2">{p.description}</td>
                <td className="px-4 py-2">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-2">{p.status}</td>
                <td className="px-4 py-2">{new Date(p.createdAt).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
