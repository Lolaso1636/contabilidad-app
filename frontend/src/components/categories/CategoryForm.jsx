import { useState, useEffect } from "react";

function CategoryForm({ onSave, categoryTree = [] }) {

  console.log("CATEGORY TREE EN FORM:", categoryTree); // ✅ AHORA SÍ EXISTE

  const [form, setForm] = useState({
    name: "",
    type: "EGRESO",
    parent_id: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Construir árbol de categorías
  const renderOptions = (nodes, level = 0) => {
    return nodes.map(node => (
      <option
        key={node.id}
        value={node.id}
        disabled={level > 0} // 👈 evita subcategorías como padre
      >
        {"— ".repeat(level)}{node.name}
      </option>
    )).concat(
      nodes.flatMap(node =>
        node.children ? renderOptions(node.children, level + 1) : []
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      name: form.name,
      type: form.type,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
    });

    setForm({
      name: "",
      type: "EGRESO",
      parent_id: "",
    });
  };

  return (
    <div className="bg-gray-900 text-slate-200 p-5 rounded-xl mb-6">
      <h3 className="text-lg font-semibold mb-4">Nueva categoría</h3>

      <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
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

        <select
          name="parent_id"
          value={form.parent_id}
          onChange={handleChange}
          className="bg-gray-800 px-3 py-2 rounded"
        >
          <option value="">Categoría principal</option>
          {renderOptions(categoryTree)}
        </select>


        <button className="bg-blue-600 px-5 py-2 rounded">
          Crear
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
