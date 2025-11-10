"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import IntentDetails from "@/components/modules/IntentDetails";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export default function IntentList() {
  const queryClient = useQueryClient();
  const [selectedIntent, setSelectedIntent] = useState(null);

  // 🔹 Buscar intenções
  const { data: intents, isLoading } = useQuery({
    queryKey: ["intents"],
    queryFn: async () => {
      const res = await api.get("/v1/intents", {
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "" },
      });
      return res.data.items || res.data;
    },
  });

  // 🔹 Mutations para aprovar/rejeitar
  const approveMutation = useMutation({
    mutationFn: async (id) =>
      api.post(`/v1/intents/${id}/approve`, null, {
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "" },
      }),
    onSuccess: () => queryClient.invalidateQueries(["intents"]),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) =>
      api.post(`/v1/intents/${id}/reject`, null, {
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "" },
      }),
    onSuccess: () => queryClient.invalidateQueries(["intents"]),
  });

  // 🔹 Ações
  const handleApprove = async (id) => {
    await approveMutation.mutateAsync(id);
    setSelectedIntent(null);
  };

  const handleReject = async (id) => {
    await rejectMutation.mutateAsync(id);
    setSelectedIntent(null);
  };

  // 🔹 Colunas
  const columns = [
    { header: "Nome", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Telefone", accessor: "phone" },
    { header: "Negócio", accessor: "business" },
    { header: "Status", accessor: "status" },
    { header: "Criado em", accessor: "createdAt" },
  ];

  const formattedData =
    intents?.map((i) => ({
      ...i,
      createdAt: new Date(i.createdAt).toLocaleString("pt-BR"),
    })) || [];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Intenções</h2>
          <Button onClick={() => queryClient.invalidateQueries(["intents"])}>
            Atualizar
          </Button>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Carregando intenções...</p>
        ) : formattedData.length === 0 ? (
          <p className="text-gray-500">Nenhuma intenção encontrada.</p>
        ) : (
          <Table
            columns={columns}
            data={formattedData}
            onRowClick={(item) => setSelectedIntent(item)}
          />
        )}
      </Card>

      {selectedIntent && (
        <IntentDetails
          intent={selectedIntent}
          onClose={() => setSelectedIntent(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
