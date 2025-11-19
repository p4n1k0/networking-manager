"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "@/services/api";
import Button from "@/components/ui/Button";

export default function MeetingForm({ memberId, onSuccess }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/meetings", { memberId, ...data });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border rounded-lg p-4 bg-white shadow"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          {...register("title", { required: true })}
          className="w-full border px-3 py-2 rounded-md"
          placeholder="Reunião com o cliente"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data
        </label>
        <input
          type="datetime-local"
          {...register("scheduledAt", { required: true })}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Agendando..." : "Agendar Reunião"}
      </Button>
    </form>
  );
}
