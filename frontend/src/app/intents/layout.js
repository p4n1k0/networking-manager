export default function IntentsLayout({ children }) {
  return (
    <div style={{ padding: 24 }}>
      <header style={{ borderBottom: "1px solid #ccc", marginBottom: 16 }}>
        <h2>Administração — Intenções</h2>
      </header>
      {children}
    </div>
  );
}
