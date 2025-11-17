"use client";

import Link from "next/link";

export default function MemberSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        {/* Ícone de sucesso */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          🎉 Cadastro Concluído!
        </h1>

        {/* Descrição */}
        <p className="text-gray-600 mb-6">
          Parabéns! Seu cadastro no Networking Manager foi realizado com sucesso.
          Agora você já pode acessar todas as funcionalidades disponíveis para membros.
        </p>

        {/* Botão de redirecionamento */}
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded shadow hover:bg-green-700 transition"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
