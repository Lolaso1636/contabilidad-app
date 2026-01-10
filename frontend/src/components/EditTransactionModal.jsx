import { useState } from "react";

export default function EditTransactionModal({ transaction, onClose, onSaved }) {
  const [form, setForm] = useState({ ...transaction });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    await fetch(`http://localhost:3000/transactions/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    onSaved();
    onClose();
  };

  return (
    <div className="modal">
      <h3>Editar transacción</h3>

      <input
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Monto"
      />

      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Descripción"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <button onClick={save}>Guardar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}
