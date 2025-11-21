"use client";

import useMemberAuth from "@/components/hooks/useMemberAuth";
import PaymentForm from "@/components/modules/PaymentForm";
import PaymentList from "@/components/modules/PaymentList";

export default function MemberPaymentsPage() {
  const member = useMemberAuth();

  if (member === undefined) {
    return <p>Carregando...</p>;
  }

  if (member === null) {
    return null; // será redirecionado
  }

  return (
    <div className="space-y-6">
      <PaymentForm />
      <PaymentList />
    </div>
  );
}
