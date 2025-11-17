"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import Button from "@/components/ui/Button";

export default function ReferralList({ memberId, type = "sent" }) {
  const queryClient = useQueryClient();

  const { data: referrals = [], isLoading, error } = useQuery({
    queryKey: ["referrals", memberId, type],
    queryFn: async () => {
      const res = await api.get(`/referrals?memberId=${memberId}&type=${type}`);
      return res.data;
    },
    enabled: !!memberId,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.patch(`/referrals/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals", memberId, type] });
    },
  });

  if (isLoading) return <p>Carregando indicações...</p>;
  if (error) return <p>Erro ao carregar indicações.</p>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">
        {type === "sent" ? "Indicações Enviadas" : "Indicações Recebidas"}
      </h3>
      <ul>
        {referrals.map(r => (
          <li key={r._id} className="flex justify-between items-center mb-2 border-b py-2">
            <div>
              <p><strong>Cliente:</strong> {r.clientName}</p>
              <p><strong>Tipo:</strong> {r.businessType}</p>
              <p><strong>Status:</strong> {r.status}</p>
            </div>
            {type === "sent" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => mutation.mutate({ id: r._id, status: "completed" })}>Concluída</Button>
                <Button size="sm" onClick={() => mutation.mutate({ id: r._id, status: "cancelled" })}>Cancelar</Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
