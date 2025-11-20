"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export default function AdminMeetingsPage() {
    const [memberId, setMemberId] = useState("");

    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ["adminMeetings", memberId],
        queryFn: async () => {
            const res = await api.get("/admin/meetings", {
                params: memberId ? { memberId } : {}
            });
            return res.data;
        }
    });

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/admin/meetings/${id}/status`, { status });
            refetch();
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar status");
        }
    };

    const deleteMeeting = async (id) => {
        if (!confirm("Deseja remover esta reunião?")) return;

        try {
            await api.delete(`/admin/meetings/${id}`);
            refetch();
        } catch (err) {
            console.error(err);
            alert("Erro ao remover treinamento");
        }
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">📅 Gestão de Reuniões</h1>

            {/* FILTRO */}
            <div className="flex gap-4">
                <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="Filtrar por ID do membro"
                    className="border px-3 py-2 rounded-md"
                />

                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Buscar
                </button>
            </div>

            {/* LISTAGEM */}
            {isLoading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p className="text-red-500">Erro ao carregar reuniões</p>
            ) : (
                <div className="space-y-4">
                    {data.map((m) => (
                        <div key={m._id} className="p-4 bg-white shadow rounded-md border">
                            <p>
                                <strong>Membros:</strong>{" "}
                                {m.members.map((me) => me.name).join(", ")}
                            </p>
                            <p>
                                <strong>Data:</strong>{" "}
                                {new Date(m.date).toLocaleString("pt-BR")}
                            </p>
                            <p>
                                <strong>Local:</strong> {m.location}
                            </p>
                            <p>
                                <strong>Status:</strong> {m.checkinStatus}
                            </p>

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => updateStatus(m._id, "checked_in")}
                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                >
                                    ✔ Check-in
                                </button>

                                <button
                                    onClick={() => updateStatus(m._id, "missed")}
                                    className="px-3 py-1 bg-yellow-600 text-white rounded"
                                >
                                    ⚠ Faltou
                                </button>

                                <button
                                    onClick={() => deleteMeeting(m._id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded"
                                >
                                    🗑 Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
