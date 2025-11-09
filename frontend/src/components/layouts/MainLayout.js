export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-semibold text-blue-600">Networking Manager</h1>
      </header>

      <div className="flex-1 container mx-auto p-6">{children}</div>

      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Networking Manager
      </footer>
    </div>
  );
}
