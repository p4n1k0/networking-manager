"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import IntentList from "@/components/modules/IntentList";
import IntentDetails from "@/components/modules/IntentDetails";

export default function AdminPage() {
  const [selectedIntent, setSelectedIntent] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["intents"],
    queryFn: async () => {
      const res = await api.get("/v1/intents", {
        headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "" },
      });
      return res.data.items || res.data;
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Painel do Administrador
        </h1>
        <Button onClick={() => refetch()}>🔄 Atualizar</Button>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-gray-500">Carregando intenções...</p>
        ) : error ? (
          <p className="text-red-500">
            Erro ao carregar intenções. Verifique o backend.
          </p>
        ) : (
          <IntentList
            intents={data || []}
            onSelect={(intent) => setSelectedIntent(intent)}
          />
        )}
      </Card>

      {selectedIntent && (
        <IntentDetails
          intent={selectedIntent}
          onClose={() => setSelectedIntent(null)}
          onAction={() => {
            refetch();
            setSelectedIntent(null);
          }}
        />
      )}
    </div>
  );
}
