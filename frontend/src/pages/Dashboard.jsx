import { Link } from "react-router-dom";
import TransactionsTable from "../components/transactions/TransactionsTable";

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      {/* Acciones rápidas */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/transactions/new"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          ➕ Nueva transacción
        </Link>

        <Link
          to="/transactions"
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
        >
          📄 Ver todas
        </Link>f
      </div>

      {/* Últimos movimientos */}
      <TransactionsTable limit={5} />
    </div>
  );
}

export default Dashboard;
