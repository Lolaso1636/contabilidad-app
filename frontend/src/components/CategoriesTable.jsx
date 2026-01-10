function CategoriesTable({ categories, onEdit, onDelete }) {
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categories.map(c => (
          <tr key={c.id}>
            <td>{c.name}</td>
            <td>{c.type}</td>
            <td>
              <button onClick={() => onEdit(c)}>✏️</button>
              <button onClick={() => onDelete(c.id)}>❌</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CategoriesTable;
