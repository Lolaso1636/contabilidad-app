import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { PieChart as PieIcon } from "lucide-react";

const COLORS = ["#3B82F6", "#22C55E", "#FACC15", "#FB7185", "#A78BFA"];

function CategoryChart({ data }) {
  // 🛡️ BLINDAJE TOTAL
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-5 mt-6 border border-slate-800 text-slate-400 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PieIcon className="w-5 h-5 text-slate-500" />
          <span className="font-medium">Distribución por categoría</span>
        </div>
        <p className="text-sm">No hay datos disponibles para este período</p>
      </div>
    );
  }

  // 🧹 NORMALIZAR DATOS (extra seguro)
  const safeData = data.map(d => ({
    category: d.category ?? "Sin categoría",
    total: Number(d.total) || 0,
  }));

  return (
    <div className="bg-gray-900 rounded-xl p-5 mt-6 border border-slate-800">
      
      {/* HEADER */}
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
        <PieIcon className="w-5 h-5 text-blue-400" />
        Distribución por categoría
      </h3>

      {/* CHART */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {safeData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                `$ ${Number(value).toLocaleString()}`
              }
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#E2E8F0",
                fontSize: "0.875rem",
              }}
            />

            <Legend
              wrapperStyle={{
                color: "#CBD5F5",
                fontSize: "0.875rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CategoryChart;
