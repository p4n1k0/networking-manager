"use client";

import useMemberAuth from "@/components/hooks/useMemberAuth";
import Card from "@/components/ui/Card";
import ReferralList from "@/components/modules/ReferralList";
import ReferralForm from "@/components/modules/ReferralForm";
import MeetingList from "@/components/modules/MeetingList";
import MeetingForm from "@/components/modules/MeetingForm";

export default function MemberDashboard() {
    const member = useMemberAuth();

    if (!member) return <p>Carregando...</p>;

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">📊 Painel do Membro</h1>

            <p>Bem-vindo, {member.name}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <ReferralForm memberId={member._id} />
                    <ReferralList memberId={member._id} />
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        📅 Reuniões
                    </h2>
                    <MeetingForm memberId={member._id} />
                    <div className="mt-4">
                        <MeetingList memberId={member._id} />
                    </div>
                </Card>
            </div>
        </div>
    );
}
