"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function IntentForm({ onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/intents", data);
      return res.data;
    },
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded-2xl shadow"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Formulário de Intenção de Participação
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome Completo"
          placeholder="João Pereira"
          {...register("name", { required: "Campo obrigatório" })}
          error={errors.name?.message}
        />

        <Input
          type="email"
          label="E-mail"
          placeholder="joao.pereira@mail.com"
          {...register("email", { required: "Campo obrigatório" })}
          error={errors.email?.message}
        />

        <Input
          label="Telefone"
          placeholder="+55 21 98888-7777"
          {...register("phone", { required: "Campo obrigatório" })}
          error={errors.phone?.message}
        />

        <Input
          label="Empresa ou Atividade"
          placeholder="Consultoria Financeira"
          {...register("business", { required: "Campo obrigatório" })}
          error={errors.business?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensagem
        </label>
        <textarea
          {...register("message", { required: "Campo obrigatório" })}
          rows={4}
          placeholder="Conte um pouco sobre você e por que quer participar..."
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        {errors.message && (
          <span className="text-red-500 text-sm">{errors.message.message}</span>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Enviando..." : "Enviar Intenção"}
        </Button>
      </div>

      {mutation.isSuccess && (
        <p className="text-green-600 text-sm mt-2">
          🎉 Intenção enviada com sucesso! Aguarde aprovação.
        </p>
      )}

      {mutation.isError && (
        <p className="text-red-600 text-sm mt-2">
          ⚠️ Ocorreu um erro ao enviar sua intenção. Tente novamente.
        </p>
      )}
    </form>
  );
}
