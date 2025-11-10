"use client";

import ReferralForm from "@/components/modules/ReferralForm";
import ReferralList from "@/components/modules/ReferralList";

/**
 * Página de Referrals
 * Mostra formulário e listas de indicações enviadas e recebidas
 */
export default function ReferralsPage() {
  const memberId = "65c901a2f4f201c1b9c8d333";

  return (
    <main className="max-w-3xl mx-auto mt-10 space-y-8">
      {/* Form para criar nova indicação */}
      <ReferralForm memberId={memberId} />

      {/* Lista de indicações enviadas */}
      <ReferralList memberId={memberId} type="sent" />

      {/* Lista de indicações recebidas */}
      <ReferralList memberId={memberId} type="received" />
    </main>
  );
}
