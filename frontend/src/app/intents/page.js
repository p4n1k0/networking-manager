"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import IntentForm from "@/components/modules/IntentForm";

export default function IntentsPage() {
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["intents"],
    queryFn: async () => {
      const res = await api.get("/v1/intents", {
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "" },
      });
      return res.data.items || res.data;
    },
  });

  const columns = [
    { header: "Nome", accessor: "name" },
    { header: "E-mail", accessor: "email" },
    { header: "Telefone", accessor: "phone" },
    { header: "Negócio", accessor: "business" },
    { header: "Status", accessor: "status" },
    { header: "Criado em", accessor: "createdAt" },
  ];

  const formattedData =
    data?.map((item) => ({
      name: item.name,
      email: item.email,
      phone: item.phone,
      business: item.business,
      status:
        item.status === "approved"
          ? "✅ Aprovado"
          : item.status === "rejected"
          ? "❌ Recusado"
          : "🕓 Pendente",
      createdAt: new Date(item.createdAt).toLocaleString("pt-BR"),
    })) || [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Intenções de Participação</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fechar" : "Nova Intenção"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <IntentForm
            onSuccess={() => {
              refetch();
              setShowForm(false);
            }}
          />
        </Card>
      )}

      <Card>
        {isLoading ? (
          <p className="text-gray-500">Carregando intenções...</p>
        ) : (
          <Table columns={columns} data={formattedData} />
        )}
      </Card>
    </div>
  );
}
