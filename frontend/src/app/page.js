import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Bem-vindo ao Sistema de Networking
      </h1>
      <p className="text-gray-600 max-w-lg mb-8">
        Aqui você pode enviar sua intenção de participação, gerenciar membros e acompanhar convites.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/intents"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Intenções
        </Link>

        <Link
          href="/admin/login"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Painel Admin
        </Link>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} Networking App
      </footer>
    </main>
  );
}
