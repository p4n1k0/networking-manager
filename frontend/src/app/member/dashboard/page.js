"use client";

import Link from "next/link";
import api from "@/services/api";
import useMemberAuth from "@/components/hooks/useMemberAuth";

export default function MemberDashboard() {
    const member = useMemberAuth();

    if (!member) return null;

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold">
                Bem-vindo, {member.name}!
            </h1>

            <p className="mt-2 text-gray-600">Você está autenticado como membro.</p>


            <h1 className="text-3xl font-bold mb-6">🔐 Painel de membros</h1>
            {/* Links do menu */}
            <ul className="mt-6 space-y-4">
                <li>
                    <Link
                        href="/member/meetings"
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
                    >
                        Gerenciar Reuniões
                    </Link>
                </li>
                <li>
                    <Link
                        href="/member/referrals"
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
                    >
                        Verificar Indicações
                    </Link>
                </li>

            </ul>
        </div>


    );
}
