function Summary({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      label: "Ingresos",
      value: summary.ingresos,
      color: "text-green-600",
    },
    {
      label: "Egresos",
      value: summary.egresos,
      color: "text-red-600",
    },
    {
      label: "Balance",
      value: summary.balance,
      color: summary.balance >= 0 ? "text-blue-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-xl shadow p-6"
        >
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className={`text-2xl font-bold mt-2 ${c.color}`}>
            ${c.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Summary;
