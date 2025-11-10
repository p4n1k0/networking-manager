"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function MemberForm({ token }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/v1/members", { token, ...data });
      return res.data;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Cadastro de Membro</h2>

      <Input
        label="Nome Completo"
        {...register("name", { required: "Campo obrigatório" })}
        error={errors.name?.message}
      />

      <Input
        type="email"
        label="E-mail"
        {...register("email", { required: "Campo obrigatório" })}
        error={errors.email?.message}
      />

      <Input
        label="Telefone"
        {...register("phone", { required: "Campo obrigatório" })}
        error={errors.phone?.message}
      />

      <Input
        label="Empresa / Negócio"
        {...register("business", { required: "Campo obrigatório" })}
        error={errors.business?.message}
      />

      <Input
        label="Cargo / Posição"
        {...register("position", { required: "Campo obrigatório" })}
        error={errors.position?.message}
      />

      <Input
        label="Empresa / Companhia"
        {...register("company", { required: "Campo obrigatório" })}
        error={errors.company?.message}
      />

      <Input
        label="LinkedIn"
        {...register("linkedin", { required: "Campo obrigatório" })}
        error={errors.linkedin?.message}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Cadastrando..." : "Cadastrar Membro"}
        </Button>
      </div>

      {mutation.isSuccess && (
        <p className="text-green-600 mt-2">🎉 Membro cadastrado com sucesso!</p>
      )}
      {mutation.isError && (
        <p className="text-red-600 mt-2">⚠️ Erro ao cadastrar membro. Tente novamente.</p>
      )}
    </form>
  );
}
