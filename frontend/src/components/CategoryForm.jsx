import { useEffect, useState } from 'react';

function CategoryForm({ onSave, editingCategory }) {
  const [form, setForm] = useState({
    name: '',
    type: 'EGRESO'
  });

  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name,
        type: editingCategory.type
      });
    }
  }, [editingCategory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ name: '', type: 'EGRESO' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        name="name"
        placeholder="Nombre categoría"
        value={form.name}
        onChange={handleChange}
        required
      />

      <select name="type" value={form.type} onChange={handleChange}>
        <option value="INGRESO">Ingreso</option>
        <option value="EGRESO">Egreso</option>
        <option value="MIXTA">Mixta</option>
      </select>

      <button type="submit">
        {editingCategory ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  );
}

export default CategoryForm;
