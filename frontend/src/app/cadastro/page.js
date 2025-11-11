"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CadastroPage({ searchParams }) {
  const { token } = searchParams;
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Verifica token ao carregar a página
  useEffect(() => {
    async function validateToken() {
      try {
        const res = await api.get(`/v1/invites/${token}/validate`);
        if (res.data.valid) {
          setValid(true);
          setEmail(res.data.intentionEmail);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (token) validateToken();
  }, [token]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/v1/members", { token, email, ...data });
      return res.data;
    },
    onSuccess: () => {
      alert("Cadastro concluído com sucesso!");
      reset();
    },
    onError: () => {
      alert("Erro ao concluir cadastro. Verifique o token ou tente novamente.");
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  if (!token) return <p>Token não fornecido.</p>;
  if (!valid) return <p>Token inválido ou expirado.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-2xl shadow max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cadastro Completo de Membro</h2>

      <Input label="Nome Completo" {...register("name", { required: "Campo obrigatório" })} error={errors.name?.message} />
      <Input label="Email" value={email} disabled />
      <Input label="Telefone" {...register("phone", { required: "Campo obrigatório" })} error={errors.phone?.message} />
      <Input label="Negócio ou Atividade" {...register("business", { required: "Campo obrigatório" })} error={errors.business?.message} />
      <Input label="Empresa" {...register("company")} />
      <Input label="Cargo" {...register("position")} />
      <Input label="LinkedIn" {...register("linkedin")} />

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
        </Button>
      </div>
    </form>
  );
}
