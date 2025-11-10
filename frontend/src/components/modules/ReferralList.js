"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Button from "@/components/ui/Button";

export default function ReferralList({ memberId, type = "sent" }) {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    if (!memberId) return;

    let isMounted = true; // evita setState se componente for desmontado

    const fetchReferrals = async () => {
      try {
        const res = await api.get(`/v1/referrals?memberId=${memberId}&type=${type}`);
        if (isMounted) setReferrals(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReferrals();

    return () => { isMounted = false; };
  }, [memberId, type]); // adiciona dependências

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/v1/referrals/${id}`, { status });
      // refetch após atualização
      const res = await api.get(`/v1/referrals?memberId=${memberId}&type=${type}`);
      setReferrals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">
        {type === "sent" ? "Indicações Enviadas" : "Indicações Recebidas"}
      </h3>
      <ul>
        {referrals.map(r => (
          <li key={r._id} className="flex justify-between items-center mb-2 border-b py-2">
            <div>
              <p><strong>Cliente:</strong> {r.clientName}</p>
              <p><strong>Tipo:</strong> {r.businessType}</p>
              <p><strong>Status:</strong> {r.status}</p>
            </div>
            <div className="flex gap-2">
              {type === "sent" && (
                <>
                  <Button size="sm" onClick={() => updateStatus(r._id, "completed")}>Concluída</Button>
                  <Button size="sm" onClick={() => updateStatus(r._id, "cancelled")}>Cancelar</Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
