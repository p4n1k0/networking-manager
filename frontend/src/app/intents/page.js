"use client";

import { useState } from "react";
import IntentList from "@/components/modules/IntentList";
import IntentForm from "@/components/modules/IntentForm";
import IntentDetails from "@/components/modules/IntentDetails";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function IntentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState(null);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Intenções de Participação
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fechar" : "Nova Intenção"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <IntentForm
            onSuccess={() => {
              setShowForm(false);
              setRefresh(!refresh); // força recarregar
            }}
          />
        </Card>
      )}

      <Card>
        <IntentList
          refresh={refresh}
          onSelect={(intent) => setSelectedIntent(intent)}
        />
      </Card>

      {/* MODAL DE DETALHES */}
      {selectedIntent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-xl p-6 shadow-xl">
            <IntentDetails
              intent={selectedIntent}
              onClose={() => setSelectedIntent(null)}
              onAction={() => {
                setSelectedIntent(null);
                setRefresh(!refresh);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
