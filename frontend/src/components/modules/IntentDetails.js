"use client";

import { useState } from "react";
import api from "@/services/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function IntentDetails({ intent, onClose, onAction }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAction = async (status) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await api.patch(
        `/v1/intents/${intent._id}`,
        { status },
        { headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "" } }
      );
      onAction();
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro ao atualizar a intenção.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">{intent.name}</h2>
        <p><strong>Email:</strong> {intent.email}</p>
        <p><strong>Telefone:</strong> {intent.phone}</p>
        <p><strong>Negócio:</strong> {intent.business}</p>
        <p><strong>Mensagem:</strong> {intent.message}</p>
        <p>
          <strong>Status:</strong>{" "}
          {intent.status === "approved"
            ? "✅ Aprovado"
            : intent.status === "rejected"
            ? "❌ Recusado"
            : "🕓 Pendente"}
        </p>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <div className="flex gap-2">
          <Button
            onClick={() => handleAction("approved")}
            disabled={loading || intent.status === "approved"}
          >
            Aprovar
          </Button>
          <Button
            onClick={() => handleAction("rejected")}
            disabled={loading || intent.status === "rejected"}
          >
            Recusar
          </Button>
          <Button onClick={onClose} variant="secondary">
            Fechar
          </Button>
        </div>
      </div>
    </Card>
  );
}
