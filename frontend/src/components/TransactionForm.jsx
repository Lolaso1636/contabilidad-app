import { useEffect, useState } from 'react';

function TransactionForm({ onSaved }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'EGRESO',
    description: '',
    date: '',
    category_id: ''
  });

  const [categories, setCategories] = useState([]);

  // 🔹 Cargar categorías
  useEffect(() => {
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('http://localhost:3001/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setForm({
      amount: '',
      type: 'EGRESO',
      description: '',
      date: '',
      category_id: ''
    });

    onSaved();
  };

  return (
    <>
      <h2>➕ Nueva transacción</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          name="amount"
          type="number"
          placeholder="Monto"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="INGRESO">Ingreso</option>
          <option value="EGRESO">Egreso</option>
        </select>

        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        {/* 👇 ESTE ES EL CAMBIO CLAVE */}
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione categoría</option>

          {categories
            .filter(c => c.type === form.type || c.type === 'MIXTA')
            .map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>

        <button type="submit">Guardar</button>
      </form>
    </>
  );
}

export default TransactionForm;
