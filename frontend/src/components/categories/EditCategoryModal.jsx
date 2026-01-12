import { useState } from "react";
import { createPortal } from "react-dom";

/* ===============================
   🔧 HELPERS (VAN AQUÍ)
   =============================== */

// Aplana el árbol de categorías
function flattenCategories(categories = []) {
  let result = [];

  function traverse(nodes) {
    nodes.forEach(node => {
      result.push(node);
      if (node.children?.length) {
        traverse(node.children);
      }
    });
  }

  traverse(categories);
  return result;
}

// Obtiene IDs de todos los hijos y nietos
function getDescendantIds(category) {
  let ids = [];

  function traverse(node) {
    node.children?.forEach(child => {
      ids.push(child.id);
      traverse(child);
    });
  }

  traverse(category);
  return ids;
}

/* ===============================
   🧩 COMPONENTE
   =============================== */

function EditCategoryModal({ category, categories = [], onClose, onSave }) {
  if (!category) return null;

  const [form, setForm] = useState({
    id: category.id,
    name: category.name,
    type: category.type,
    parent_id: category.parent_id ?? "",
  });

  const descendantIds = getDescendantIds(category);

  const parentOptions = flattenCategories(categories).filter(c =>
    c.id !== category.id &&            // no sí misma
    !descendantIds.includes(c.id)     // no hijos ni nietos
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
    });
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
        <h3 className="text-xl font-semibold mb-5">✏️ Editar categoría</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded"
            required
          />

          {/* Tipo */}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded"
          >
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
            <option value="MIXTA">Mixta</option>
          </select>

          {/* Categoría padre */}
          <select
            name="parent_id"
            value={form.parent_id}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded"
          >
            <option value="">— Categoría principal —</option>

            {parentOptions.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded">
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
