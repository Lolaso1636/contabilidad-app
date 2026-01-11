function Sidebar({ setPage, page }) {
  const item = (key, label, icon) => (
    <button
      onClick={() => setPage(key)}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded mt-2 transition
        ${page === key
          ? "bg-purple-600 text-white"
          : "text-gray-300 hover:bg-gray-700"}
      `}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="w-56 bg-gray-900 text-white p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6">💰 Contabilidad</h2>

      {item("dashboard", "Dashboard", "📊")}
      {item("transactions", "Transacciones", "💸")}
      {item("categories", "Categorías", "📁")}
      {item("reports", "Reportes", "📈")}
    </div>
  );
}

export default Sidebar;
