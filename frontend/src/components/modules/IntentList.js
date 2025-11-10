"use client";

import React from "react";
import Button from "@/components/ui/Button";

export default function IntentList({ intents = [], onSelect }) {
  if (!intents.length) {
    return <p className="text-gray-500">Nenhuma intenção encontrada.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nome</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">E-mail</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Telefone</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Negócio</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Criado em</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {intents.map((intent) => (
            <tr key={intent._id}>
              <td className="px-4 py-2">{intent.name}</td>
              <td className="px-4 py-2">{intent.email}</td>
              <td className="px-4 py-2">{intent.phone}</td>
              <td className="px-4 py-2">{intent.business}</td>
              <td className="px-4 py-2">
                {intent.status === "approved"
                  ? "✅ Aprovado"
                  : intent.status === "rejected"
                  ? "❌ Recusado"
                  : "🕓 Pendente"}
              </td>
              <td className="px-4 py-2">
                {new Date(intent.createdAt).toLocaleString("pt-BR")}
              </td>
              <td className="px-4 py-2 text-center">
                <Button size="sm" onClick={() => onSelect(intent)}>
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
