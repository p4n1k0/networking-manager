"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import MemberForm from "@/components/modules/MemberForm";

export default function MemberPage({ params }) {
  const { token } = params;
  const [valid, setValid] = useState(null); // null = carregando, true/false = status

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await api.get(`/v1/invites/${token}/validate`);
        setValid(res.data.valid);
      } catch (err) {
        setValid(false);
      }
    };
    validateToken();
  }, [token]);

  if (valid === null) return <p>Verificando token...</p>;
  if (valid === false) return <p className="text-red-600">Token inválido ou expirado.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <MemberForm token={token} />
    </div>
  );
}
