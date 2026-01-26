export default function AccountsSummary({ accounts }) {
  if (!accounts || accounts.length === 0) {
    return (
      <p className="text-slate-400 mb-6">
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

  const stylesByType = {
    BANK: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
    },
    CASH: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
    },
    WALLET: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {accounts.map((acc) => {
        const style = stylesByType[acc.type] || {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
        };

        return (
          <div
            key={acc.id}
            className={`
              rounded-xl
              p-5
              border
              shadow-sm
              ${style.bg}
              ${style.border}
            `}
          >
            <h3 className="text-sm font-medium text-slate-500">
              {acc.name}
            </h3>

            <p className={`text-2xl font-bold mt-2 ${style.text}`}>
              {formatMoney(acc.balance)}
            </p>

            <p className="text-xs uppercase tracking-wide mt-1 text-slate-400">
              {acc.type}
            </p>
          </div>
        );
      })}
    </div>
  );
}
