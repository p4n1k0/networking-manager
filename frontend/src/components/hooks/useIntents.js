"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useIntents() {
  return useQuery(["intents"], async () => {
    const res = await api.get("/intents", {
      headers: {
        "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY,
      },
    });

    return res.data;
  });
}
