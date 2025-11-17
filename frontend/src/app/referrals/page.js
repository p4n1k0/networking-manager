"use client";

import { useEffect, useState } from "react";
import ReferralForm from "@/components/modules/ReferralForm";
import ReferralList from "@/components/modules/ReferralList";

export default function ReferralsPage() {
  const [user, setUser] = useState(null);

  // Garantir execução apenas no client
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  if (!user) {
    return <p className="p-4 text-center">Carregando...</p>;
  }

  return (
    <main className="max-w-3xl mx-auto mt-10 space-y-8">
      <ReferralForm memberId={user._id} />

      {/* Enviadas */}
      <ReferralList memberId={user._id} type="sent" />

      {/* Recebidas */}
      <ReferralList memberId={user._id} type="received" />
    </main>
  );
}
