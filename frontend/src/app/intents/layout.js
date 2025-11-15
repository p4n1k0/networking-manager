export default function IntentsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Intenções
        </h2>
      </header>
      <section>{children}</section>
    </div>
  );
}
