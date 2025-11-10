"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import api from "@/services/api";

export default function IntentDetails({ intent, onClose, onAction }) {
  if (!intent) return null;

  const handleAction = async (status) => {
    try {
      await api.patch(
        `/v1/intents/${intent._id}`,
        { status },
        {
          headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "" },
        }
      );
      if (onAction) onAction();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Detalhes da Intenção
        </h2>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <div className="space-y-2 text-gray-700">
        <p><strong>Nome:</strong> {intent.name}</p>
        <p><strong>E-mail:</strong> {intent.email}</p>
        <p><strong>Telefone:</strong> {intent.phone}</p>
        <p><strong>Negócio:</strong> {intent.business}</p>
        <p><strong>Mensagem:</strong> {intent.message}</p>
        <p><strong>Status:</strong> {intent.status}</p>
        <p>
          <strong>Criado em:</strong>{" "}
          {new Date(intent.createdAt).toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          variant="success"
          onClick={() => handleAction("approved")}
        >
          Aprovar
        </Button>
        <Button
          variant="danger"
          onClick={() => handleAction("rejected")}
        >
          Rejeitar
        </Button>
      </div>
    </Card>
  );
}
