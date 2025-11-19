"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export default function MeetingList({ memberId }) {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["meetings", memberId],
    queryFn: async () => {
      const res = await api.get(`/meetings?memberId=${memberId}`);
      return res.data.items || res.data;
    },
  });

  if (isLoading) return <p>Carregando reuniões...</p>;
  if (error) return <p className="text-red-500">Erro ao carregar reuniões.</p>;

  return (
    <div className="space-y-2">
      {data.length === 0 ? (
        <p>Nenhuma reunião encontrada.</p>
      ) : (
        data.map((meeting) => (
          <div
            key={meeting.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span className="font-medium">{meeting.title}</span>
            <span className="text-sm text-gray-500">
              {new Date(meeting.scheduledAt).toLocaleString("pt-BR")}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
