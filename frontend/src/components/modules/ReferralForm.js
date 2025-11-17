"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";

export default function ReferralForm({ memberId, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [token, setToken] = useState(null);

  // Garantir execução apenas no cliente
  useEffect(() => {
    const stored = localStorage.getItem("token");
    setToken(stored);
  }, []);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      const res = await api.post(
        "/referrals",
        {
          fromMemberId: memberId,
          ...data
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      reset();
      if (onSuccess) onSuccess(data);
    }
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded-2xl shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Nova Indicação</h2>

      <Input
        label="ID do Membro Indicado"
        placeholder="Exemplo: 65fa91b0af8..."
        {...register("toMemberId", { required: "Campo obrigatório" })}
        error={errors.toMemberId?.message}
      />

      <Input
        label="Nome do Cliente"
        placeholder="Ex: João da Silva"
        {...register("clientName", { required: "Campo obrigatório" })}
        error={errors.clientName?.message}
      />

      <Input
        label="Tipo de Negócio"
        placeholder="Ex: Consultoria, Venda, Parceria"
        {...register("businessType")}
      />

      <Input
        label="Descrição"
        placeholder="Descreva brevemente a indicação"
        {...register("description")}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Enviando..." : "Enviar Indicação"}
        </Button>
      </div>

      {/* Mensagem de sucesso */}
      {mutation.isSuccess && (
        <p className="text-green-600 mt-2">
          ✔ Indicação criada com sucesso!
        </p>
      )}

      {/* Mensagem de erro real */}
      {mutation.isError && (
        <p className="text-red-600 text-sm mt-2">
          Erro ao criar indicação:{" "}
          {mutation.error?.response?.data?.error ||
            mutation.error?.message ||
            "Erro desconhecido"}
        </p>
      )}
    </form>
  );
}
