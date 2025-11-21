"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function PaymentForm({ memberId }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Se memberId existe, envia junto (admin criando pagamento para outro membro)
      const payload = memberId ? { ...data, memberId } : data;
      return api.post("/payments", payload);
    },
    onSuccess: () => {
      reset();
      // Atualiza a query correta no React Query
      queryClient.invalidateQueries(memberId ? ["payments", memberId] : ["myPayments"]);
    },
  });

  const onSubmit = (data) => {
    data.amount = parseFloat(data.amount);
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Registrar Pagamento</h2>

      <Input
        type="number"
        step="0.01"
        placeholder="Ex: 100.00"
        label="Valor"
        {...register("amount", { required: true })}
      />
      <Input
        type="date"
        label="Vencimento"
        {...register("dueDate", { required: true })}
      />

      <select {...register("method")} className="border p-2 rounded w-full">
        <option value="pix">PIX</option>
        <option value="boleto">Boleto</option>
        <option value="cartao">Cartão</option>
        <option value="transferencia">Transferência</option>
      </select>

      <Input label="Observações" {...register("notes")} />

      <Button type="submit">Registrar</Button>
    </form>
  );
}
