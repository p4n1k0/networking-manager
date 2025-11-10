"use client";

import IntentList from "@/components/modules/IntentList";
import IntentForm from "@/components/modules/IntentForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function IntentsPage() {
  const [showForm, setShowForm] = useState(false);

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
          <IntentForm onSuccess={() => setShowForm(false)} />
        </Card>
      )}

      {/* 🔹 Lista completa de intenções */}
      <IntentList />
    </div>
  );
}
