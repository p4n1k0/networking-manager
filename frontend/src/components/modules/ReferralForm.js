"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ReferralForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/referrals", data);
      return res.data;
    },
    onSuccess: (data) => {
      reset();
      if (onSuccess) onSuccess(data);
    }
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <Input
        label="ID do Membro Indicado"
        placeholder="Ex: 65fa91b0af8c9d43e8177df8"
        {...register("toMemberId", {
          required: "Campo obrigatório",
          validate: (v) =>
            /^[0-9a-fA-F]{24}$/.test(v) ||
            "ID inválido — deve conter 24 caracteres hexadecimais"
        })}
        error={errors.toMemberId?.message}
      />

      <Input
        label="Cliente"
        {...register("clientName", { required: "Campo obrigatório" })}
        error={errors.clientName?.message}
      />

      <Input label="Tipo do Negócio" {...register("businessType")} />

      <Input label="Descrição" {...register("description")} />

      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Enviando..." : "Enviar Indicação"}
      </Button>

      {mutation.isError && (
        <p className="text-red-600">{mutation.error?.response?.data?.error}</p>
      )}

      {mutation.isSuccess && (
        <p className="text-green-600">✔ Indicação criada!</p>
      )}
    </form>
  );
}
