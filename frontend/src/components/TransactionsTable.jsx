function TransactionsTable({ transactions, onDelete }) {
  return (
    <>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td>{t.description}</td>
              <td>${t.amount}</td>
              <td>
                <button onClick={() => onDelete(t.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TransactionsTable;
