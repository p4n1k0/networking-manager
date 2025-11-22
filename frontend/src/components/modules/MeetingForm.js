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
      return await api.post("/meetings", {
        date: data.date,
        type: "one_to_one",
        notes: data.notes,
        location: data.location,
        durationMinutes: Number(data.durationMinutes),
        members: [memberId, data.partnerId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings", memberId] });
      reset();
      onSuccess?.(); // <-- deixa o parent tratar a mensagem
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4 border rounded-lg p-4 bg-white shadow"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          ID do outro membro
        </label>
        <input
          {...register("partnerId", {
            required: "ID do parceiro é obrigatório",
            validate: v => /^[0-9a-fA-F]{24}$/.test(v) || "ID inválido",
          })}
          className="w-full border px-3 py-2 rounded-md"
          placeholder="65fa91b0af8c9d43e8177df8"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data da Reunião
        </label>
        <input
          type="datetime-local"
          {...register("date", { required: true })}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Local
        </label>
        <input
          {...register("location")}
          placeholder="Online ou Presencial"
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duração (min)
        </label>
        <input
          type="number"
          defaultValue={60}
          {...register("durationMinutes")}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notas
        </label>
        <textarea
          {...register("notes")}
          placeholder="Observações..."
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Agendando..." : "Agendar Reunião"}
      </Button>
    </form>
  );
}
