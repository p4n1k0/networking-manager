"use client";

import { useState } from "react";
import PaymentForm from "@/components/modules/PaymentForm";
import PaymentList from "@/components/modules/PaymentList";

export default function PaymentPage() {
  const [memberId, setMemberId] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gestão de Pagamentos</h1>

      <div className="bg-white p-4 rounded-2xl shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por ID do Membro
        </label>
        <input
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          placeholder="Ex: 64f12abc123"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <PaymentForm memberId={memberId} onSuccess={() => console.log("Pagamento salvo")} />
      <PaymentList memberId={memberId} />
    </div>
  );
}
