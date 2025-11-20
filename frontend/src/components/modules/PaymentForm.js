"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";

export default function PaymentForm({ memberId, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/payments", { memberId, ...data });
      return res.data;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["payments", memberId] });
      onSuccess?.();
    },
  });

  const onSubmit = (data) => {
    data.amount = parseFloat(data.amount);
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Registrar Pagamento</h2>

      <Input
        label="Descrição"
        placeholder="Comissão sobre indicação"
        {...register("description", { required: "Campo obrigatório" })}
        error={errors.description?.message}
      />

      <Input
        type="number"
        step="0.01"
        label="Valor (R$)"
        placeholder="Ex: 230.50"
        {...register("amount", { required: "Campo obrigatório" })}
        error={errors.amount?.message}
      />

      <Input
        label="Status"
        placeholder="pending, paid ou cancelled"
        {...register("status", { required: "Campo obrigatório" })}
        error={errors.status?.message}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Salvando..." : "Registrar Pagamento"}
        </Button>
      </div>

      {mutation.isSuccess && (
        <p className="text-green-600 text-sm mt-2">
          ✅ Pagamento registrado com sucesso!
        </p>
      )}

      {mutation.isError && (
        <p className="text-red-600 text-sm mt-2">
          ⚠️ Erro ao registrar pagamento.
        </p>
      )}
    </form>
  );
}
