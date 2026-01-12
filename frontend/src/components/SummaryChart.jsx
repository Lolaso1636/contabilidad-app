import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function SummaryChart({ data }) {
  if (!data) return null;

  const chartData = {
    labels: ["Ingresos", "Egresos"],
    datasets: [
      {
        label: "Monto ($)",
        data: [data.ingresos, data.egresos],
        backgroundColor: ["#22c55e", "#ef4444"], // Tailwind green/red
        borderRadius: 8,
        barThickness: 50
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb"
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => `$ ${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#cbd5f5" },
        grid: { display: false }
      },
      y: {
        ticks: {
          color: "#cbd5f5",
          callback: value => `$ ${value.toLocaleString()}`
        },
        grid: {
          color: "#334155"
        }
      }
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-md max-w-xl">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
        📊 <span>Ingresos vs Egresos</span>
      </h3>

      <Bar data={chartData} options={options} />
    </div>
  );
}

export default SummaryChart;
