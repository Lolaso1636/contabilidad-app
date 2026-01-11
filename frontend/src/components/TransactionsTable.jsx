function TransactionsTable({ transactions, onDelete, onEdit }) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📄 Movimientos</h3>

        <input
          type="text"
          placeholder="🔍 Buscar por descripción..."
          className="bg-gray-800 px-3 py-2 rounded text-sm w-64 focus:outline-none"
        />
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="py-2 text-left">Fecha</th>
            <th className="py-2 text-left">Tipo</th>
            <th className="py-2 text-left">Categoría</th>
            <th className="py-2 text-left">Descripción</th>
            <th className="py-2 text-right">Monto</th>
            <th className="py-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(t => (
            <tr
              key={t.id}
              className="border-b border-gray-800 hover:bg-gray-800 transition"
            >
              <td className="py-3">
                {t.date.slice(0, 10)}
              </td>
            
              <td
                className={`py-3 font-semibold ${
                  t.type === "INGRESO"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {t.type}
              </td>

              <td className="py-3">{t.category}</td>
              <td className="py-3">{t.description}</td>

              <td className="py-3 text-right font-medium">
                ${t.amount.toLocaleString()}
              </td>

              <td className="py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(t)}
                    className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                    title="Editar"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => onDelete(t.id)}
                    className="bg-red-600/20 hover:bg-red-600/40 px-2 py-1 rounded"
                    title="Eliminar"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
