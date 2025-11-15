"use client";

import { useState } from "react";
import IntentForm from "@/components/modules/IntentForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function IntentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = () => {
    setShowForm(false);
    setRefresh(!refresh);

    setSuccessMessage("🎉 Intenção enviada com sucesso!");

    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="p-8 space-y-6">

      {/* 🔔 AVISO DE SUCESSO */}
      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fechar" : "Nova Intenção"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <IntentForm onSuccess={handleSuccess} />
        </Card>
      )}
      
    </div>
  );
}
