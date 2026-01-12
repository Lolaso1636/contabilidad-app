import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CirclePlus,
  Folder,
  ChartColumnStacked,
  BadgeDollarSign,
} from "lucide-react";


function Sidebar() {
  const { pathname } = useLocation();

  const item = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${pathname === to
          ? "bg-purple-600 text-white"
          : "text-gray-300 hover:bg-gray-800"}
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <BadgeDollarSign className="w-6 h-6 text-green-400" />
        Contabilidad
      </h2>

      {item("/", "Dashboard", LayoutDashboard)}
      {item("/transactions/new", "Nueva transacción", CirclePlus)}
      {item("/categories", "Categorías", Folder)}
      {item("/reports", "Reportes", ChartColumnStacked)}
    </aside>
  );
}

export default Sidebar;
