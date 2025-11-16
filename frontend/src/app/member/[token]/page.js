"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/services/api";
import MemberForm from "@/components/modules/MemberForm";

export default function MemberTokenPage() {
  const { token } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function validate() {
      try {
        const res = await api.get(`/invites/${token}/validate`);
        if (res.data.valid) {
          setValid(true);
          setInvite(res.data);
        } else {
          setError(res.data.message || "Convite inválido.");
        }
      } catch (err) {
        console.error(err);
        setError("Não foi possível validar este convite.");
      } finally {
        setLoading(false);
      }
    }

    if (token) validate();
  }, [token]);

  async function onSubmit(data) {
    try {
      await api.post("/members", { ...data, token });
      router.push("/member/sucesso");
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao criar cadastro");
    }
  }

  if (loading) return <div className="p-6">Validando convite...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Finalizar Cadastro</h1>
      <p className="text-gray-600 mb-6">
        Convite para: <strong>{invite.intentionEmail}</strong>
      </p>

      <MemberForm onSubmit={onSubmit} />
    </div>
  );
}
