import { useState } from "react";
import { createPortal } from "react-dom";

function EditTransactionModal({ transaction, categories, onClose, onSave }) {
  if (!transaction) return null;

  const [form, setForm] = useState({
    id: transaction.id,
    amount: transaction.amount,
    type: transaction.type,
    description: transaction.description,
    date: transaction.date.slice(0, 10),
    category_id: transaction.category_id
  });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const safeDate = form.date + "T12:00:00"; // ⬅️ CLAVE

    onSave({
      id: form.id,
      amount: Number(form.amount),
      type: form.type,
      description: form.description,
      date: safeDate,
      category_id: Number(form.category_id)
    });
  };


  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[2147483647]"

      
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">✏️ Editar transacción</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full bg-gray-800 p-2 rounded"
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full bg-gray-800 p-2 rounded"
          >
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
          </select>

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full bg-gray-800 p-2 rounded"
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full bg-gray-800 p-2 rounded"
            required
          />

          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-gray-800 p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-700 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-purple-600 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default EditTransactionModal;
