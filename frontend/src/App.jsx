import { useEffect, useState } from "react";

// Componentes
import Summary from "./components/Summary";
import TransactionForm from "./components/TransactionForm";
import TransactionsTable from "./components/TransactionsTable";
import CategoryForm from "./components/CategoryForm";
import CategoriesTable from "./components/CategoriesTable";
import EditTransactionModal from "./components/EditTransactionModal";
import SummaryChart from "./components/SummaryChart";
import ReportFilters from "./components/ReportFilters";
import CategoryChart from "./components/CategoryChart";

function App() {
  // ===============================
  // NAVEGACIÓN
  // ===============================
  const [page, setPage] = useState("dashboard");

  // ===============================
  // ESTADOS
  // ===============================
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [monthlySummary, setMonthlySummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);

  // ===============================
  // CARGA INICIAL
  // ===============================
  useEffect(() => {
    loadSummary();
    loadTransactions();
    loadCategories();
  }, []);

  const loadSummary = async () => {
    const res = await fetch("http://localhost:3001/api/summary");
    setSummary(await res.json());
  };

  const loadTransactions = async () => {
    const res = await fetch("http://localhost:3001/api/transactions");
    setTransactions(await res.json());
  };

  const loadCategories = async () => {
    const res = await fetch("http://localhost:3001/api/categories");
    setCategories(await res.json());
  };

  // ===============================
  // REPORTES
  // ===============================
  const generateReport = async (year, month) => {
    try {
      const res1 = await fetch(
        `http://localhost:3001/api/summary/monthly?year=${year}&month=${month}`
      );
      const monthly = await res1.json();

      const ingresos = Number(monthly?.ingresos || 0);
      const egresos = Number(monthly?.egresos || 0);

      if (ingresos === 0 && egresos === 0) {
        setMonthlySummary(null);
      } else {
        setMonthlySummary({
          ingresos,
          egresos,
          balance: ingresos - egresos,
        });
      }

      const res2 = await fetch(
        `http://localhost:3001/api/summary/category?year=${year}&month=${month}`
      );
      const raw = await res2.json();

      setCategorySummary(
        raw.map((c) => ({
          category: c.category ?? c.name,
          total: Number(c.total ?? 0),
        }))
      );
    } catch (err) {
      console.error(err);
      setMonthlySummary(null);
      setCategorySummary([]);
    }
  };

  // ===============================
  // CATEGORÍAS
  // ===============================
  const saveCategory = async (category) => {
    if (editingCategory) {
      await fetch(
        `http://localhost:3001/api/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        }
      );
      setEditingCategory(null);
    } else {
      await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
    }
    loadCategories();
  };

  const deleteCategory = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    await fetch(`http://localhost:3001/api/categories/${id}`, {
      method: "DELETE",
    });
    loadCategories();
  };

  // ===============================
  // MOVIMIENTOS
  // ===============================
  const deleteTransaction = async (id) => {
    if (!confirm("¿Eliminar movimiento?")) return;
    await fetch(`http://localhost:3001/api/transactions/${id}`, {
      method: "DELETE",
    });
    loadTransactions();
    loadSummary();
  };

  // ===============================
  // UI
  // ===============================
  return (
    <>
      {/* LAYOUT PRINCIPAL */}
      <div className="flex min-h-screen bg-gray-100">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold">💰 Contabilidad</h2>
            <p className="text-sm text-slate-400 mt-1">Control financiero</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setPage("dashboard")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                page === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              📊 Dashboard
            </button>

            <button
              onClick={() => setPage("categories")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                page === "categories"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              📁 Categorías
            </button>

            <button
              onClick={() => setPage("reports")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                page === "reports"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              📈 Reportes
            </button>
          </nav>
        </aside>

        {/* CONTENIDO */}
        <main className="flex-1 p-8 bg-slate-100">
          {page === "dashboard" && (
            <>
              <Summary summary={summary} />

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <TransactionForm
                  onSaved={() => {
                    loadTransactions();
                    loadSummary();
                  }}
                />

                <TransactionsTable
                  transactions={transactions}
                  onDelete={deleteTransaction}
                  onEdit={setEditingTransaction}
                />
              </div>
            </>
          )}

          {page === "categories" && (
            <>
              <h2 className="text-2xl font-bold mb-4">📁 Categorías</h2>
              <CategoryForm
                onSave={saveCategory}
                editingCategory={editingCategory}
              />
              <CategoriesTable
                categories={categories}
                onEdit={setEditingCategory}
                onDelete={deleteCategory}
              />
            </>
          )}

          {page === "reports" && (
            <>
              <h2 className="text-2xl font-bold mb-4">📊 Reportes</h2>
              <ReportFilters onGenerate={generateReport} />

              {monthlySummary && <SummaryChart data={monthlySummary} />}
              {categorySummary.length > 0 && (
                <CategoryChart data={categorySummary} />
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL (FUERA DEL LAYOUT) */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={() => setEditingTransaction(null)}
          onSave={async (updated) => {
            await fetch(
              `http://localhost:3001/api/transactions/${updated.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
              }
            );

            setEditingTransaction(null);
            loadTransactions();
            loadSummary();
          }}
        />
      )}
    </>
  );
}

export default App;
