import { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/fetchWithAuth";

function Accounts({ accounts = [], onEdit, onRefresh }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    balance: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetchWithAuth("/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        type: form.type,
        balance: Number(form.balance || 0),
      }),
    });

    setForm({ name: "", type: "", balance: "" });
    onRefresh(); // 🔄 refresca desde App
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta cuenta?")) return;

    await fetchWithAuth(`/accounts/${id}`, {
      method: "DELETE",
    });

    onRefresh(); // 🔄 refresca desde App
  };

  const formatMoney = (value) =>
    Number(value).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });

  return (
    <div className="p-6 text-slate-200">
      <h1 className="text-2xl font-bold mb-6 text-slate-100">Cuentas</h1>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          name="name"
          placeholder="Nombre de la cuenta"
          value={form.name}
          onChange={handleChange}
          required
          className="bg-slate-800 px-3 py-2 rounded text-slate-200"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="bg-slate-800 px-3 py-2 rounded text-slate-200"
        >
          <option value="">Tipo de cuenta</option>
          <option value="BANK">Banco</option>
          <option value="CASH">Efectivo</option>
          <option value="WALLET">Billetera digital</option>
        </select>

        <input
          name="balance"
          type="number"
          placeholder="Saldo inicial"
          value={form.balance}
          onChange={handleChange}
          className="bg-slate-800 px-3 py-2 rounded text-slate-200"
        />

        <button
          type="submit"
          className="md:col-span-3 bg-slate-800 hover:bg-blue-600/40 text-slate-100 py-2 rounded font-semibold"
        >
          Crear cuenta
        </button>
      </form>

      {/* LISTADO */}
      {accounts.length === 0 ? (
        <p className="text-slate-400">No hay cuentas registradas</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4"
            >
              <h3 className="text-base font-semibold text-slate-100">
                {acc.name}
              </h3>

              <p className="text-xs text-slate-400 uppercase mt-1">
                {acc.type}
              </p>

              <p className="text-xl font-bold text-slate-100 mt-3">
                {formatMoney(acc.balance)}
              </p>

              <div className="flex gap-2 mt-4">
                {/* 🔥 AQUÍ ESTÁ LA CLAVE */}
                <button
                  onClick={() => onEdit(acc)}
                  className="flex-1 bg-slate-800 hover:bg-blue-600/30 text-blue-400 py-1 rounded"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(acc.id)}
                  className="flex-1 bg-slate-800 hover:bg-red-600/30 text-red-400 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Accounts;
