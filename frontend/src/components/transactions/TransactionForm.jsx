import { useEffect, useState } from "react";
import { MessageSquarePlus } from "lucide-react";
function TransactionForm({ onSaved }) {
  const [form, setForm] = useState({
    amount: "",
    type: "EGRESO",
    description: "",
    date: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:3001/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      amount: "",
      type: "EGRESO",
      description: "",
      date: "",
      category_id: "",
    });

    onSaved();
  };

  return (
    <div className="bg-gray-900 text-slate-200 p-6 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-4">
        <MessageSquarePlus className="w-5 h-5 inline mr-" /> Nueva transacción</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="amount"
          type="number"
          placeholder="Monto"
          value={form.amount}
          onChange={handleChange}
          required
          className="bg-gray-800 text-slate-200 placeholder-slate-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="bg-gray-800 text-slate-200 px-3 py-2 rounded focus:outline-none"
        >
          <option value="INGRESO">Ingreso</option>
          <option value="EGRESO">Egreso</option>
        </select>

        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="bg-gray-800 text-slate-200 placeholder-slate-400 px-3 py-2 rounded focus:outline-none md:col-span-2"
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="bg-gray-800 text-slate-200 px-3 py-2 rounded focus:outline-none"
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
          className="bg-gray-800 text-slate-200 px-3 py-2 rounded focus:outline-none"
        >
          <option value="">Seleccione categoría</option>
          {categories
            .filter((c) => c.type === form.type || c.type === "MIXTA")
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>

        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-semibold"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
