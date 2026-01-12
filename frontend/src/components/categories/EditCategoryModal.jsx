import { useState } from "react";
import { createPortal } from "react-dom";

function EditCategoryModal({ category, onClose, onSave }) {
  if (!category) return null;

  const [form, setForm] = useState({
    id: category.id,
    name: category.name,
    type: category.type,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center
                 bg-black/70 backdrop-blur-sm text-slate-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-gradient-to-b
                   from-slate-900 to-slate-800 p-6 shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
          ✏️ <span>Editar categoría</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Nombre
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-900 border border-slate-700
                         px-3 py-2 focus:outline-none focus:ring-2
                         focus:ring-blue-500"
              required
            />
          </div>

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
              <option value="MIXTA">Mixta</option>
            </select>
          </div>

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
              className="rounded-lg px-4 py-2 text-sm font-medium
                         bg-blue-600 hover:bg-blue-500 transition"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default EditCategoryModal;
