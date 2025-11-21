"use client";

import useMemberAuth from "@/components/hooks/useMemberAuth";
import ReferralList from "@/components/modules/ReferralList";
import ReferralForm from "@/components/modules/ReferralForm";

export default function DashboardPage() {
  const member = useMemberAuth();

  if (member === undefined) return null; // carregando
  if (member === null) return null; // redirecionando

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Minhas Indicações
      </h1>

      <ReferralForm memberId={member._id} />

      <ReferralList memberId={member._id} type="sent" />

      <ReferralList memberId={member._id} type="received" />
    </div>
  );
}
