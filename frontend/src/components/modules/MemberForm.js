"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "@/services/api";
import Button from "@/components/ui/Button";

export default function MemberForm({ initialData = null, onSuccess }) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      business: "",
      password: "",
      role: "member",
      status: "active",
      profile: {
        company: "",
        position: "",
        linkedin: "",
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Não enviar senha vazia na edição
      if (initialData && !data.password) {
        delete data.password;
      }

      if (initialData) {
        return await api.put(`/members/${initialData._id}`, data);
      }

      return await api.post("/members", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      reset();
      onSuccess?.();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4 border rounded-lg p-4 bg-white shadow"
    >
      <h2 className="text-lg font-semibold">
        {initialData ? "Editar Membro" : "Cadastrar Membro"}
      </h2>

      <div>
        <label className="block text-sm font-medium">Nome</label>
        <input {...register("name", { required: true })} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" {...register("email", { required: true })} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium">Telefone</label>
        <input {...register("phone")} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium">Business</label>
        <input {...register("business")} className="w-full border px-3 py-2 rounded-md" />
      </div>

      {/* Password (somente obrigatório no cadastro) */}
      <div>
        <label className="block text-sm font-medium">Senha</label>
        <input
          type="password"
          {...register("password", initialData ? {} : { required: true })}
          className="w-full border px-3 py-2 rounded-md"
          placeholder={initialData ? "Deixe vazio para não alterar" : ""}
        />
      </div>

      {/* Profile */}
      <div className="pt-2">
        <h3 className="text-md font-semibold text-gray-700">Perfil</h3>

        <label className="block text-sm mt-2">Empresa</label>
        <input {...register("profile.company")} className="w-full border px-3 py-2 rounded-md" />

        <label className="block text-sm mt-2">Posição</label>
        <input {...register("profile.position")} className="w-full border px-3 py-2 rounded-md" />

        <label className="block text-sm mt-2">LinkedIn</label>
        <input {...register("profile.linkedin")} className="w-full border px-3 py-2 rounded-md" />
      </div>

      {/* Role e Status */}
      <div>
        <label className="block text-sm font-medium">Cargo</label>
        <select {...register("role")} className="w-full border px-3 py-2 rounded-md">
          <option value="member">Membro</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select {...register("status")} className="w-full border px-3 py-2 rounded-md">
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending
          ? initialData
            ? "Salvando..."
            : "Cadastrando..."
          : initialData
          ? "Salvar"
          : "Cadastrar"}
      </Button>
    </form>
  );
}
