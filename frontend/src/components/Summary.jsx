import {
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

function Summary({ summary }) {
  if (!summary) return null;

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
      icon: Wallet,
      bg: "bg-blue-50",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Resumen general
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;

          return (
            <div
              key={c.label}
              className={`rounded-2xl p-6 border border-gray-200 ${c.bg}`}
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
                    ${c.value.toLocaleString()}
                  </p>
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
