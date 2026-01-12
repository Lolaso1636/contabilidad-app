import { useEffect, useState } from "react";

import { Pencil, PlusCircle } from "lucide-react";

function CategoryForm({ onSave }) {
  const [form, setForm] = useState({
    name: "",
    type: "EGRESO",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ name: "", type: "EGRESO" });
  };

  return (
    <div className="bg-gray-900 text-slate-200 p-5 rounded-xl mb-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
        Nueva categoría
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre categoría"
          className="flex-1 bg-gray-800 px-3 py-2 rounded"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="bg-gray-800 px-3 py-2 rounded"
        >
          <option value="INGRESO">Ingreso</option>
          <option value="EGRESO">Egreso</option>
          <option value="MIXTA">Mixta</option>
        </select>

        <button className="bg-blue-600 px-5 py-2 rounded">
          Crear
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
