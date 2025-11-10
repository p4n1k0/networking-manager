"use client";

import { useState } from "react";
import IntentList from "@/components/modules/IntentList";
import IntentForm from "@/components/modules/IntentForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function IntentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
              setRefresh(!refresh); // 🔄 força o IntentList a refazer o fetch
            }}
          />
        </Card>
      )}

      <IntentList refresh={refresh} />
    </div>
  );
}
