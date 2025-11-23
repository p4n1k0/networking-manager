"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import Button from "@/components/ui/Button";

export default function ReferralList({ memberId, type = "sent" }) {
  const queryClient = useQueryClient();

  // 1. Carregar TODAS as indicações relacionadas ao membro
  const { data: referrals = [], isLoading, error } = useQuery({
    queryKey: ["referrals", memberId],
    queryFn: async () => {
      const res = await api.get(`/referrals/member/${memberId}`);
      return res.data; // backend devolve enviadas + recebidas
    },
    enabled: !!memberId,
  });

  // 2. Filtrar pelo tipo desejado
  const filtered = referrals.filter((ref) =>
    type === "sent"
      ? ref.fromMemberId?._id === memberId
      : ref.toMemberId?._id === memberId
  );

  // 3. Mutação para atualizar status
  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await api.patch(`/referrals/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["referrals", memberId]);
    },
  });

  if (isLoading) return <p>Carregando indicações...</p>;
  if (error) return <p>Erro ao carregar indicações.</p>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">
        {type === "sent" ? "Indicações Enviadas" : "Indicações Recebidas"}
      </h3>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-sm">
          Nenhuma indicação {type === "sent" ? "enviada" : "recebida"}.
        </p>
      )}

      <ul className="space-y-3">
        {filtered.map((r) => (
          <li key={r._id} className="border rounded-lg p-3 flex justify-between">
            <div>
              <p><strong>Cliente:</strong> {r.clientName}</p>
              <p><strong>Tipo:</strong> {r.businessType}</p>
              <p><strong>Status:</strong>
                <span className="capitalize ml-1">
                  {r.status.replace("_", " ")}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {type === "sent"
                  ? `Para: ${r.toMemberId?.name}`
                  : `De: ${r.fromMemberId?.name}`}
              </p>
            </div>

            {type === "sent" && (
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => mutation.mutate({ id: r._id, status: "won" })}
                >
                  Concluída
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => mutation.mutate({ id: r._id, status: "lost" })}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
