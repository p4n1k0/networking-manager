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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");
    if (form.password !== form.confirmPassword) return setError("Senhas não coincidem.");
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ...inputs para name, email, phone, business ... */}
      <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Senha" />
      <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirmar senha" />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Cadastrando..." : "Finalizar Cadastro"}</button>
    </form>
  );
}
