"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";


export default function CadastroPage({ params }) {
  const { token } = params;
  const [valid, setValid] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function validate() {
      try {
        const res = await api.get(`/invites/${token}/validate`);
        if (res.data?.valid) setValid(true);
        else setValid(false);
      } catch (err) {
        setValid(false);
      }
    }
    validate();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/members", { token, ...form });
      setMsg("Cadastro concluído! Você já pode entrar no sistema.");
    } catch (err) {
      console.error(err);
      setMsg("Erro ao completar cadastro.");
    }
  };

  if (valid === null) return <p>Validando token...</p>;
  if (!valid) return <p>Token inválido ou expirado.</p>;

  return (

    <main className="max-w-md mx-auto p-6">

      <h1 className="text-2xl font-bold mb-4">Completar Cadastro</h1>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-6 rounded shadow">

        <input name="name" placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-2" required />
        <input name="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border p-2" required />
        <input name="phone" placeholder="Telefone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border p-2" />
        <input name="company" placeholder="Empresa" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full border p-2" />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Completar cadastro</button>

      </form>

      {msg && <p className="mt-3">{msg}</p>}

    </main>
  );
}
