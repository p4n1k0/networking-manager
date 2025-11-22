"use client";

import { useState } from "react";
import useMemberAuth from "@/components/hooks/useMemberAuth";
import MeetingForm from "@/components/modules/MeetingForm";
import MeetingList from "@/components/modules/MeetingList";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function MeetingsPage() {
  const member = useMemberAuth();
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (member === undefined) return <p>Carregando...</p>;
  if (member === null) return null;

  const handleSuccess = () => {
    setShowForm(false);
    setRefresh((prev) => !prev);

    setSuccessMessage("🎉 Reunião agendada com sucesso!");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="p-8 space-y-6">
      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fechar" : "Agendar Reunião"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <MeetingForm memberId={member._id} onSuccess={handleSuccess} />
        </Card>
      )}    

      <Card>
        <h1 className="text-2xl font-bold mb-4">📅 Reuniões de {member.name}</h1>
        <MeetingList memberId={member._id} refresh={refresh} />
      </Card>
    </div>
  );
}
