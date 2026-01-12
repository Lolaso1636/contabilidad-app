import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Save, Pencil } from "lucide-react";

function EditTransactionModal({
  transaction,
  categories = [],
  onClose,
  onSave,
}) {
  if (!transaction) return null;

  const [form, setForm] = useState({
    id: transaction.id,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date?.slice(0, 10),
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      amount: Number(form.amount),
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647]
                 flex items-center justify-center
                 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl
                   bg-gradient-to-b from-slate-900 to-slate-800
                   text-slate-200 p-6 shadow-2xl
                   border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Pencil className="w-5 h-5 text-blue-400" />
            Editar transacción
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* MONTO */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Monto
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700
                         px-3 py-2 focus:outline-none focus:ring-2
                         focus:ring-blue-500"
              required
            />
          </div>

          {/* TIPO */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Tipo
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700
                         px-3 py-2 focus:outline-none focus:ring-2
                         focus:ring-blue-500"
            >
              <option value="INGRESO">Ingreso</option>
              <option value="EGRESO">Egreso</option>
            </select>
          </div>

          {/* CATEGORÍA */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Categoría
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700
                         px-3 py-2 focus:outline-none focus:ring-2
                         focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Descripción
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700
                         px-3 py-2 focus:outline-none focus:ring-2
                         focus:ring-blue-500"
            />
          </div>

          {/* FECHA */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700
                         px-3 py-2 focus:outline-none focus:ring-2
                         focus:ring-blue-500"
            />
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm
                         bg-slate-700 hover:bg-slate-600 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg
                         px-4 py-2 text-sm font-medium
                         bg-blue-600 hover:bg-blue-500 transition"
            >
              <Save className="w-4 h-4" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default EditTransactionModal;
