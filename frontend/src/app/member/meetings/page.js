"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import MeetingForm from "@/components/modules/MeetingForm";
import MeetingList from "@/components/modules/MeetingList";

export default function MeetingsPage() {
  const [memberId, setMemberId] = useState("");

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">📅 Reuniões</h1>

      <Card>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ID do Membro
        </label>

        <input
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          placeholder="Ex: 65fa91b0af8c9d43e8177df8"
          className="border w-full px-3 py-2 rounded-md mb-4"
        />

        {memberId && !isValidObjectId(memberId) && (
          <p className="text-red-600 text-sm">
            ❌ ID inválido — deve conter 24 caracteres hexadecimais.
          </p>
        )}

        {isValidObjectId(memberId) && (
          <div className="mt-6">
            <MeetingForm memberId={memberId} onSuccess={() => { }} />
            <h2 className="text-lg font-semibold mb-2">Reuniões do membro</h2>
            <MeetingList memberId={memberId} />

          </div>
        )}
      </Card>
    </div>
  );
}
