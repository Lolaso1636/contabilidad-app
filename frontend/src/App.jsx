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
import CategoriesTree from "./components/categories/CategoriesTable";
import AccountsSummary from "./components/accounts/AccountsSummary";
import Accounts from "./pages/Accounts";
import EditAccountModal from "./components/accounts/EditAccountModal";
import AuthGate from './components/AuthGate';
import { fetchWithAuth } from "./api/fetchWithAuth";








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
  const [categoryTree, setCategoryTree] = useState([]);

  // NUEVO ESTADO PARA CUENTAS
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);


  
  // ===============================
  // CARGA INICIAL
  // ===============================
  useEffect(() => {
    loadSummary();
    loadTransactions();
    loadCategories();
    loadCategoryTree();
    fetchAccounts();  
  }, []);

  const loadSummary = async () => {
    const res = await fetchWithAuth("/summary");
    const data = await res.json();
    setSummary(data);
  };


  const loadTransactions = async () => {
    const res = await fetchWithAuth("/transactions");

    if (!res.ok) {
      console.error("Error cargando transactions");
      setTransactions([]);
      return;
    }

    const data = await res.json();
    setTransactions(Array.isArray(data) ? data : []);
  };


  const loadCategories = async () => {
    const res = await fetchWithAuth("/categories");
    const data = await res.json();
    setCategories(data);
  };

  const loadCategoryTree = async () => {
    try {
      const res = await fetchWithAuth("/categories/tree");

      if (!res.ok) {
        throw new Error("Error cargando category tree");
      }

      const data = await res.json();
      console.log("CATEGORY TREE CARGADO:", data);
      setCategoryTree(data);
    } catch (err) {
      console.error(err);
      setCategoryTree([]);
    }
  };





  // ===============================
  // REPORTES
  // ===============================
  const generateReport = async (year, month) => {
    try {
      // ===== RESUMEN MENSUAL =====
      const res1 = await fetchWithAuth(
        `/summary/monthly?year=${year}&month=${month}`
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
      const res2 = await fetchWithAuth(
        `/summary/category?year=${year}&month=${month}`
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
      await fetchWithAuth(
        `/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        }
      );
      setEditingCategory(null);
    } else {
      await fetchWithAuth("/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
    }
    loadCategories();
    loadCategoryTree();
  };

  const deleteCategory = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    await fetchWithAuth(`/categories/${id}`, {
      method: "DELETE",
    });
    loadCategories();
  };

  // ===============================
  // MOVIMIENTOS
  // ===============================
  const deleteTransaction = async (id) => {
    if (!confirm("¿Eliminar movimiento?")) return;
    await fetchWithAuth(`/transactions/${id}`, {
      method: "DELETE",
    });
    loadTransactions();
    loadSummary();
  };

// NUEVA FUNCIÓN PARA CARGAR CUENTAS
  const fetchAccounts = async () => {
    const res = await fetchWithAuth("/accounts");
    const data = await res.json();
    setAccounts(data);
  };




  return (
    <>
      <Routes>
        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <>
               {/* CUENTAS */}
              <AccountsSummary accounts={accounts} />

              {/* RESUMEN GENERAL */}
              {summary && <Summary summary={summary} />}

              {/* TABLA DE MOVIMIENTOS */}
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
              accounts={accounts}
              categories={categories}
              onSaved={() => {
                loadTransactions();
                loadSummary();
                fetchAccounts();  
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
                categoryTree={categoryTree}   // ✅ AHORA SÍ
                onSave={saveCategory}
              />
              <CategoriesTree
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
        
        {/* ✅ CUENTAS */}
              <Route
        path="/accounts"
        element={
          <Accounts
            accounts={accounts}
            onEdit={setEditingAccount}
            onRefresh={fetchAccounts}
          />
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
            await fetchWithAuth(
              `/transactions/${updated.id}`,
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
          categories={categories}
          onClose={() => setEditingCategory(null)}
          onSave={async (updated) => {
            await fetchWithAuth(
              `/categories/${updated.id}`,
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

      {editingAccount && (
        <EditAccountModal
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSave={async (updated) => {
            await fetchWithAuth(
              `/accounts/${updated.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
              }
            );

            setEditingAccount(null);
            fetchAccounts();   // refresca cuentas
            loadSummary();     // refresca dashboard
          }}
        />
      )}


    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Layout>
          <AppContent />
        </Layout>
      </AuthGate>
    </BrowserRouter>
  );
}