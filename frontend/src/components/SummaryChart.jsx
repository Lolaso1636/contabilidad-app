import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
    labels: ['Ingresos', 'Egresos'],
    datasets: [
      {
        label: 'Resumen mensual',
        data: [data.ingresos, data.egresos],
        backgroundColor: ['#4CAF50', '#F44336']
      }
    ]
  };

  return (
    <div style={{ maxWidth: 500, marginTop: '2rem' }}>
      <h3>📊 Ingresos vs Egresos</h3>
      <Bar data={chartData} />
    </div>
  );
}

export default SummaryChart;
