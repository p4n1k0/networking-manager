"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import Button from "@/components/ui/Button";

export default function MeetingList({ memberId, refresh }) {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["meetings", memberId, refresh],
    queryFn: async () => {
      const res = await api.get(`/meetings/member/${memberId}`);
      return res.data;
    },
    enabled: !!memberId,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await api.patch(`/meetings/${id}/status`, { status });
    },
    onSuccess() {
      queryClient.invalidateQueries(["meetings", memberId]);
    }
  });

  if (isLoading) return <p>Carregando reuniões...</p>;
  if (error) return <p className="text-red-500">Erro ao carregar reuniões.</p>;

  return (
    <div className="space-y-2">
      {data.length === 0 ? (
        <p>Nenhuma reunião encontrada.</p>
      ) : (
        data.map((meeting) => (
          <div key={meeting._id} className="border-b py-3">
            <div className="flex justify-between">
              <span className="font-medium">
                {meeting.notes || "Reunião 1 a 1"}
              </span>

              <span className="text-sm text-gray-500">
                {new Date(meeting.date).toLocaleString("pt-BR")}
              </span>
            </div>

            {/* 🔥 STATUS ATUAL */}
            <p className="text-sm mt-1">
              <strong>Status:</strong>{" "}
              <span className="px-2 py-1 rounded bg-gray-200">
                {meeting.checkinStatus}
              </span>
            </p>

            {/* 🔥 BOTÕES DE ALTERAR STATUS */}
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                className="bg-green-600 text-white"
                onClick={() =>
                  mutation.mutate({ id: meeting._id, status: "checked_in" })
                }
              >
                Fazer Check-in
              </Button>

              <Button
                size="sm"
                className="bg-red-600 text-white"
                onClick={() =>
                  mutation.mutate({ id: meeting._id, status: "missed" })
                }
              >
                Marcar como Faltou
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
