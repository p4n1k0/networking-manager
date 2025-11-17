"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useMemberAuth() {
    const router = useRouter();
    const [member, setMember] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("memberToken");
        const info = localStorage.getItem("memberInfo");

        if (!token || !info) {
            router.push("/member/login");
            return;
        }

        // evita setState síncrono dentro do effect
        Promise.resolve().then(() => {
            setMember(JSON.parse(info));
        });

    }, [router]);

    return member;
}
