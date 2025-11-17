"use client";

import useMemberAuth from "@/components/hooks/useMemberAuth";

export default function MemberDashboard() {
    const member = useMemberAuth();

    if (!member) return null;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                Bem-vindo, {member.name}!
            </h1>

            <p className="mt-2 text-gray-600">Você está autenticado como membro.</p>
        </div>
    );
}
