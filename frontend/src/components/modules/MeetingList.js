"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export default function MeetingList({ memberId }) {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["meetings", memberId],
    queryFn: async () => {
      const res = await api.get(`/meetings/member/${memberId}`);
      return res.data;
    },
    enabled: !!memberId,
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
            key={meeting._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span className="font-medium">
              {meeting.notes || "Reunião 1 a 1"}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(meeting.date).toLocaleString("pt-BR")}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
