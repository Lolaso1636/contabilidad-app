import { Pencil, Trash2, Wallet } from "lucide-react";

function AccountsTable({ accounts = [], onDelete }) {
  const formatMoney = (value) =>
    Number(value).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });

  return (
    <div className="bg-slate-900 text-slate-200 rounded-xl p-5 mt-6 border border-slate-800">
      <h3 className="text-lg font-semibold mb-4 text-slate-100">
        <Wallet className="w-5 h-5 inline mr-2" /> Cuentas
      </h3>

      <table className="w-full text-sm">
        <thead className="border-b border-slate-800 text-slate-400">
          <tr>
            <th className="py-2 text-left">Nombre</th>
            <th className="py-2 text-left">Tipo</th>
            <th className="py-2 text-right">Saldo</th>
            <th className="py-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {accounts.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-6 text-center text-slate-400">
                No hay cuentas registradas
              </td>
            </tr>
          ) : (
            accounts.map((acc) => (
              <tr
                key={acc.id}
                className="border-b border-slate-800 hover:bg-slate-800/60 transition"
                >

                <td className="py-3">{acc.name}</td>
                <td className="py-3 capitalize">{acc.type}</td>
                <td className="py-3 text-right font-medium">
                  {formatMoney(acc.balance)}
                </td>
                <td className="py-3 text-right font-semibold text-slate-100">
                  <button
                    onClick={() => onDelete(acc.id)}
                    className="bg-slate-800 hover:bg-red-600/30 p-2 rounded transition"
                    >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AccountsTable;
