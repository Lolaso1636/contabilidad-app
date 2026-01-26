import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
} from "lucide-react";

function Summary({ summary }) {
  if (!summary) return null;

  const balancePositive = summary.balance >= 0;

  const cards = [
    {
      label: "Ingresos",
      value: summary.ingresos,
      icon: TrendingUp,
      bg: "bg-green-50",
      text: "text-green-700",
      iconBg: "bg-green-100",
    },
    {
      label: "Egresos",
      value: summary.egresos,
      icon: TrendingDown,
      bg: "bg-red-50",
      text: "text-red-700",
      iconBg: "bg-red-100",
    },
    {
      label: "Balance",
      value: summary.balance,
      icon: balancePositive ? Wallet : AlertTriangle,
      bg: balancePositive ? "bg-blue-50" : "bg-red-50",
      text: balancePositive ? "text-blue-700" : "text-red-700",
      iconBg: balancePositive ? "bg-blue-100" : "bg-red-100",
      highlight: true,
    },
  ];

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-6">
        Resumen general
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;

          return (
            <div
              key={c.label}
              className={`
                rounded-2xl p-6 border
                ${c.bg}
                ${c.highlight ? "border-2" : "border-gray-200"}
                hover:shadow-lg transition-all
              `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${c.iconBg}`}
                >
                  <Icon
                    className={`w-6 h-6 ${c.text}`}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {c.label}
                  </p>

                  <p
                    className={`text-2xl font-bold mt-1 ${c.text}`}
                  >
                    ${Number(c.value).toLocaleString()}
                  </p>

                  {c.label === "Balance" && (
                    <p className="text-xs mt-1 text-gray-500">
                      {balancePositive
                        ? "Saldo disponible"
                        : "Saldo en negativo"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Summary;
