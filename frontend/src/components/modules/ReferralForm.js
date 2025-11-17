"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ReferralForm({ memberId, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/referrals", { fromMemberId: memberId, ...data });
      return res.data;
    },
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Nova Indicação</h2>

      <Input label="Para Membro (ID)" {...register("toMemberId", { required: "Campo obrigatório" })} error={errors.toMemberId?.message} />
      <Input label="Nome do Cliente" {...register("clientName", { required: "Campo obrigatório" })} error={errors.clientName?.message} />
      <Input label="Tipo de Negócio" {...register("businessType", { required: "Campo obrigatório" })} error={errors.businessType?.message} />
      <Input label="Descrição" {...register("description", { required: "Campo obrigatório" })} error={errors.description?.message} />

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Enviando..." : "Enviar Indicação"}
        </Button>
      </div>

      {mutation.isSuccess && <p className="text-green-600 mt-2">Indicação criada com sucesso!</p>}
      {mutation.isError && <p className="text-red-600 mt-2">Erro ao criar indicação.</p>}
    </form>
  );
}
