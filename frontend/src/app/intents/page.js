"use client";

import { useState } from "react";
import api from "@/services/api";

export default function IntencaoPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/v1/intents", form);
      setMsg("Intenção enviada — obrigado! Aguarde contato.");
      setForm({ name: "", email: "", phone: "", business: "" });
    } catch (err) {
      console.error(err);
      setMsg("Erro ao enviar intenção.");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quero participar</h1>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-6 rounded shadow">
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} className="w-full border p-2" required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2" required />
        <input name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} className="w-full border p-2" />
        <input name="business" placeholder="Área de atuação" value={form.business} onChange={handleChange} className="w-full border p-2" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Enviar intenção</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </main>
  );
}
