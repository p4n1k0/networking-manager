"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useMemberAuth() {
  const router = useRouter();
  const [member, setMember] = useState(undefined); 
  // undefined = carregando
  // null = não autenticado

  useEffect(() => {
    const load = () => {
      try {
        const token = localStorage.getItem("memberToken");
        const info = localStorage.getItem("memberInfo");

        if (!token || !info) {
          setMember(null);
          return;
        }

        // Evita erro síncrono
        const parsed = JSON.parse(info);

        // Executa o setState ASSÍNCRONO → evita warnings
        Promise.resolve().then(() => {
          setMember(parsed);
        });

      } catch (e) {
        console.warn("Erro interpretando memberInfo:", e);
        setMember(null);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (member === null) {
      router.push("/member/login");
    }
  }, [member, router]);

  return member;
}
