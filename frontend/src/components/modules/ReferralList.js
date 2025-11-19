"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import Button from "@/components/ui/Button";

export default function ReferralList({ memberId, type = "sent" }) {
  const queryClient = useQueryClient();

  const { data: referrals = [], isLoading, error } = useQuery({
    queryKey: ["referrals", memberId],
    queryFn: async () => {
      const res = await api.get(`/referrals/member/${memberId}`);
      return res.data;
    },
    enabled: !!memberId,
  });

  const filtered = referrals.filter((ref) =>
    type === "sent"
      ? ref.fromMemberId?._id === memberId
      : ref.toMemberId?._id === memberId
  );

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar indicações.</p>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">
        {type === "sent" ? "Indicações Enviadas" : "Indicações Recebidas"}
      </h3>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">Nenhuma indicação encontrada.</p>
      )}

      <ul className="space-y-3">
        {filtered.map((r) => (
          <li key={r._id} className="border rounded-lg p-3">
            <p><strong>Cliente:</strong> {r.clientName}</p>
            <p><strong>Tipo:</strong> {r.businessType}</p>
            <p><strong>Status:</strong> {r.status}</p>

            <p className="text-sm text-gray-500 mt-1">
              {type === "sent"
                ? `Para: ${r.toMemberId?.name}`
                : `De: ${r.fromMemberId?.name}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
