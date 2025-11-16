"use client";

import { useState } from "react";

export default function MemberForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    company: "",
    position: "",
    linkedin: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // validação simples do formulário
    if (form.password.trim().length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      {/* Seção: Informações Básicas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          📋 Informações Básicas
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="input"
            placeholder="Ex: João Silva"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail *
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
            placeholder="joao@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className="input"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Área de Atuação *
          </label>
          <input
            name="business"
            type="text"
            value={form.business}
            onChange={handleChange}
            required
            className="input"
            placeholder="Ex: Marketing, TI, Consultoria"
          />
        </div>
      </div>

      {/* Profissional */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          💼 Informações Profissionais
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Empresa
          </label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="input"
            placeholder="Nome da empresa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo
          </label>
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            className="input"
            placeholder="Ex: CEO, Diretor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <input
            name="linkedin"
            type="url"
            value={form.linkedin}
            onChange={handleChange}
            className="input"
            placeholder="https://linkedin.com/in/seu-perfil"
          />
        </div>
      </div>

      {/* Senha */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          🔐 Criar Senha de Acesso
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha *
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
            placeholder="********"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Senha *
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="input"
            placeholder="********"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}
      </div>

      {/* Botão */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
          }`}
        >
          {loading ? "⏳ Cadastrando..." : "✅ Finalizar Cadastro"}
        </button>
      </div>

      <p className="text-sm text-gray-500 text-center pt-2">
        * Campos obrigatórios
      </p>
    </div>
  );
}
