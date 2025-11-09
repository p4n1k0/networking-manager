"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useIntents() {
  return useQuery(["intents"], async () => {
    const res = await api.get("/v1/intents", {
      headers: { "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "" },
    });
    return res.data.items || res.data;
  });
}
