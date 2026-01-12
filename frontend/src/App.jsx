import { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

// COMPONENTES
import Summary from "./components/Summary";
import TransactionForm from "./components/transactions/TransactionForm";
import TransactionsTable from "./components/transactions/TransactionsTable";
import CategoryForm from "./components/categories/CategoryForm";
import CategoriesTable from "./components/categories/CategoriesTable";
import EditTransactionModal from "./components/transactions/EditTransactionModal";
import SummaryChart from "./components/SummaryChart";
import ReportFilters from "./components/ReportFilters";
import CategoryChart from "./components/categories/CategoryChart";
import Sidebar from "./components/Sidebar";
import EditCategoryModal from "./components/categories/EditCategoryModal";


function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* AQUÍ SE RENDERIZA EL SIDEBAR */}
      <Sidebar />

      <main className="flex-1 p-8 bg-slate-100">
        {children}
      </main>
    </div>
  );
}


function AppContent() {
  // ===============================
  // ESTADOS (IGUAL QUE ANTES)
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
      // ===== RESUMEN MENSUAL =====
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

      // ===== RESUMEN POR CATEGORÍA =====
      const res2 = await fetch(
        `http://localhost:3001/api/summary/category?year=${year}&month=${month}`
      );

      const raw = await res2.json(); // ✅ CORREGIDO

      if (!Array.isArray(raw)) {
        console.error("Respuesta inválida de categorías:", raw);
        setCategorySummary([]);
        return;
      }

      setCategorySummary(
        raw.map(r => ({
          category: r.category ?? r.name ?? "Sin categoría",
          total: Number(r.total ?? 0),
        }))
      );

    } catch (error) {
      console.error("Error generando reporte:", error);
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


  return (
    <>
      <Routes>
        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <>
              {summary && <Summary summary={summary} />}

              <TransactionsTable
                transactions={transactions}
                onDelete={deleteTransaction}
                onEdit={setEditingTransaction}
              />
            </>
          }
        />

        {/* NUEVA TRANSACCIÓN */}
        <Route
          path="/transactions/new"
          element={
            <TransactionForm
              onSaved={() => {
                loadTransactions();
                loadSummary();
              }}
            />
          }
        />

        {/* CATEGORÍAS */}
        <Route
          path="/categories"
          element={
            <>
              <CategoryForm
                onSave={saveCategory}
              />
              <CategoriesTable
                categories={categories}
                onEdit={setEditingCategory}
                onDelete={deleteCategory}
              />
            </>
          }
        />

        {/* REPORTES */}
        <Route
          path="/reports"
          element={
            <>
              <ReportFilters onGenerate={generateReport} />
              {monthlySummary && <SummaryChart data={monthlySummary} />}
              {categorySummary.length > 0 && (
                <CategoryChart data={categorySummary} />
              )}
            </>
          }
        />
      </Routes>

      {/* MODAL */}
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

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={async (updated) => {
            await fetch(
              `http://localhost:3001/api/categories/${updated.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
              }
            );

            setEditingCategory(null);
            loadCategories();
          }}
        />
      )}

    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppContent />
      </Layout>
    </BrowserRouter>
  );
}
