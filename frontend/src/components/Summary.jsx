function Summary({ summary }) {
  if (!summary) return <p>Cargando resumen...</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      <div>
        <h3>Ingresos</h3>
        <p>${summary.ingresos}</p>
      </div>
      <div>
        <h3>Egresos</h3>
        <p>${summary.egresos}</p>
      </div>
      <div>
        <h3>Balance</h3>
        <p>${summary.balance}</p>
      </div>
    </div>
  );
}

export default Summary;
