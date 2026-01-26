export default function AccountsSummary({ accounts }) {
  if (!accounts || accounts.length === 0) {
    return (
      <p className="text-gray-500 mb-6">
        No hay cuentas registradas
      </p>
    );
  }

  const formatMoney = (value) =>
    Number(value).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className="bg-white rounded-xl shadow p-5 border border-gray-100"
        >
          <h3 className="text-sm text-gray-500">
            {acc.name}
          </h3>

          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatMoney(acc.balance)}
          </p>
        </div>
      ))}
    </div>
  );
}
