import { useEffect, useState } from "react";
import AccountForm from "../components/AccountForm";
import { fetchWithAuth } from "./api/fetchWithAuth";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);

  const fetchAccounts = async () => {
    const res = await fetchWithAuth("/accounts");
    const data = await res.json();
    setAccounts(data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSave = async (account) => {
    if (account.id) {
      // EDITAR
      await fetchWithAuth(`/accounts/${account.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
    } else {
      // CREAR
      await fetchWithAuth("/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
    }

    setEditingAccount(null);
    fetchAccounts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta cuenta?")) return;

    await fetch(`http://localhost:3001/api/accounts/${id}`, {
      method: "DELETE",
    });

    fetchAccounts();
  };

  return (
    <div className="p-6">
      <AccountForm
        onSave={handleSave}
        editingAccount={editingAccount}
        onCancel={() => setEditingAccount(null)}
      />

      <div className="bg-slate-900 rounded-xl p-5 text-slate-200 border border-slate-800">
        <h3 className="text-lg font-semibold mb-4 text-slate-100">Cuentas</h3>

        <table className="w-full text-sm">
          <thead className="text-lg font-semibold mb-4 text-slate-100">
            <tr>
              <th className="text-left py-2">Nombre</th>
              <th>Tipo</th>
              <th>Saldo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id} className="border-b border-slate-800 hover:bg-slate-800/60">
                <td className="py-2">{acc.name}</td>
                <td className="text-center">{acc.type}</td>
                <td className="text-center">
                  ${Number(acc.balance).toLocaleString("es-CO")}
                </td>
                <td className="text-right flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingAccount(acc)}
                    className="bg-slate-800 hover:bg-blue-600/30 px-3 py-1 rounded text-blue-400 transition"
                    >
                    Editar
                    </button>

                    <button
                    onClick={() => handleDelete(acc.id)}
                    className="bg-slate-800 hover:bg-red-600/30 px-3 py-1 rounded text-red-400 transition"
                    >
                    Borrar
                    </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Accounts;
