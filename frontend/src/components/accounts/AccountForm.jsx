import { useState, useEffect } from "react";

function AccountForm({ onSave, editingAccount, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    type: "BANK",
    balance: "",
  });

  useEffect(() => {
    if (editingAccount) {
      setForm({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: editingAccount.balance,
      });
    }
  }, [editingAccount]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      id: editingAccount?.id,
      name: form.name,
      type: form.type,
      balance: Number(form.balance || 0),
    });

    setForm({ name: "", type: "BANK", balance: "" });
  };

  return (
    <div className="bg-gray-900 text-slate-200 p-5 rounded-xl mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {editingAccount ? "Editar cuenta" : "Nueva cuenta"}
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre cuenta"
          className="flex-1 bg-gray-800 px-3 py-2 rounded"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="bg-gray-800 px-3 py-2 rounded"
        >
          <option value="BANK">Banco</option>
          <option value="CASH">Efectivo</option>
          <option value="WALLET">Billetera</option>
        </select>

        <input
          name="balance"
          type="number"
          value={form.balance}
          onChange={handleChange}
          placeholder="Saldo inicial"
          className="bg-gray-800 px-3 py-2 rounded w-40"
        />

        <button className="bg-slate-800 hover:bg-blue-600/40 px-5 py-2 rounded transition">
          {editingAccount ? "Actualizar" : "Crear"}
        </button>

        {editingAccount && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded transition"
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}

export default AccountForm;
