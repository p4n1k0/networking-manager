"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function ReferralsAdminPage() {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Carrega token e define header
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            window.location.href = "/admin/login";
            return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        loadReferrals();
    }, []);

    // 🔹 Função para buscar indicações
    const loadReferrals = async () => {
        setLoading(true);
        try {
            const res = await api.get("/referrals");
            setReferrals(res.data);
        } catch (err) {
            console.error(err);
            alert("Erro ao carregar indicações.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Atualizar status
    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/referrals/${id}/status`, { status });
            loadReferrals();
        } catch (err) {
            alert("Erro ao atualizar status.");
            console.error(err);
        }
    };

    if (loading) return <div className="p-6">Carregando indicações...</div>;

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">📇 Gestão de Indicações</h1>

            {referrals.length === 0 ? (
                <p className="text-gray-600">Nenhuma indicação encontrada.</p>
            ) : (
                <div className="space-y-4">
                    {referrals.map((ref) => (
                        <div key={ref._id} className="p-4 bg-white rounded shadow">
                            <p><b>De:</b> {ref.fromMemberId?.name}</p>
                            <p><b>Para:</b> {ref.toMemberId?.name}</p>
                            <p><b>Cliente:</b> {ref.clientName}</p>
                            <p><b>Tipo:</b> {ref.businessType}</p>
                            <p><b>Descrição:</b> {ref.description}</p>
                            <p><b>Status:</b> {ref.status}</p>

                            <div className="flex gap-2 mt-3">

                                {/* ✔ Concluído = WON */}
                                <button
                                    onClick={() => updateStatus(ref._id, "won")}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    ✔ Concluído
                                </button>

                                {/* ✖ Perdido */}
                                <button
                                    onClick={() => updateStatus(ref._id, "lost")}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    ✖ Perdido
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
