import { Pencil, Trash2, ScrollText, Search} from "lucide-react";

function TransactionsTable({ transactions = [], onDelete, onEdit }) {
  return (
    <div className="bg-gray-900 text-slate-200 rounded-xl p-5 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          <ScrollText className="w-5 h-5 inline mr-2" /> Movimientos</h3>

            <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 peer-focus:text-blue-400" />
              <input
                type="text"
                placeholder="Buscar por descripción..."
                className="w-full bg-gray-800 text-slate-200 placeholder-slate-400
                          pl-10 pr-3 py-2 rounded text-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              </div>
      </div>

      <table className="w-full text-sm">
        <thead className="text-slate-100 border-b border-slate-700">
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
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="py-6 text-center text-slate-400"
              >
                No hay transacciones registradas
              </td>
            </tr>
          ) : (
            transactions.map(t => (
              <tr
                key={t.id}
                className="border-b border-slate-700 hover:bg-slate-800 transition"
              >
                <td className="py-3">{t.date.slice(0, 10)}</td>

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
                      onClick={() => {
                        console.log("EDITANDO:", t);
                        onEdit(t);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 p-2 rounded transition"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4 text-slate-200" />
                    </button>



                    <button
                      onClick={() => onDelete(t.id)}
                      className="bg-red-600/20 hover:bg-red-600/40 px-2 py-1 rounded transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}

export default TransactionsTable;
