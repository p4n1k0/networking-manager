"use client";
import { useIntents } from "@/services/hooks/useIntents";

export default function AdminPage() {
  const { data: items, isLoading, error } = useIntents();

  if (isLoading) return <p>Carregando intenções...</p>;
  if (error) return <p>Erro ao carregar intenções 😥</p>;

  return (
    <div>
      <h1>Lista de Intenções</h1>
      {items?.length ? (
        <ul>
          {items.map((i) => (
            <li key={i.id}>{i.nome} - {i.email}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma intenção encontrada</p>
      )}
    </div>
  );
}
