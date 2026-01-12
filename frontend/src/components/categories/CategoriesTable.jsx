import { Pencil, Trash2, ScrollText, FolderCheck} from "lucide-react";
function CategoriesTable({ categories, onEdit, onDelete }) {
  return (
    <div className="bg-gray-900 text-slate-200 rounded-xl p-5 mt-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">
        <FolderCheck className="w-5 h-5 inline mr-2" /> Categorías
      </h3>

      <table className="w-full text-sm">
        <thead className="text-slate-200 border-b border-gray-700">
          <tr>
            <th className="py-2 text-left">Nombre</th>
            <th className="py-2 text-left">Tipo</th>
            <th className="py-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr
              key={c.id}
              className="border-b border-gray-700 hover:bg-gray-800 transition"
            >
              <td className="py-3">{c.name}</td>

              <td
                className={`py-3 font-semibold ${
                  c.type === "INGRESO"
                    ? "text-green-400"
                    : c.type === "EGRESO"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {c.type}
              </td>

              <td className="py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(c)}
                    className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                    title="Editar"
                  >
                      <Pencil
                        className="w-4 h-4 text-slate-200"
                        onClick={() => onEdit(c)}
                      />
                  </button>

                  <button
                    onClick={() => onDelete(c.id)}
                    className="bg-red-600/20 hover:bg-red-600/40 px-2 py-1 rounded"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
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

export default CategoriesTable;
