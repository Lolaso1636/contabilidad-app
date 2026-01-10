import { useEffect, useState } from 'react';
const API_URL = "http://localhost:3001/api/summary";
// Componentes
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionsTable from './components/TransactionsTable';
import CategoryForm from './components/CategoryForm';
import CategoriesTable from './components/CategoriesTable';
import EditTransactionModal from "./components/EditTransactionModal";
import SummaryChart from './components/SummaryChart';
import ReportFilters from './components/ReportFilters';
import CategoryChart from './components/CategoryChart';



function App() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState("ALL");

  // Reportes (solo cuando el usuario los pide)
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
    const res = await fetch('http://localhost:3001/api/summary');
    setSummary(await res.json());
  };

  const loadTransactions = async () => {
    const res = await fetch('http://localhost:3001/api/transactions');
    setTransactions(await res.json());
  };

  const loadCategories = async () => {
    const res = await fetch('http://localhost:3001/api/categories');
    setCategories(await res.json());
  };

  // ===============================
  // GENERAR REPORTE (BOTÓN)
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
        balance: ingresos - egresos
      });
    }

    // ===== CATEGORÍAS =====
    const res2 = await fetch(
      `http://localhost:3001/api/summary/category?year=${year}&month=${month}`
    );

    const rawCategories = await res2.json();

    const normalizedCategories = rawCategories.map(c => ({
      category: c.category ?? c.name ?? c.categoria,
      total: Number(c.total ?? c.amount ?? c.suma ?? 0)
    }));

    setCategorySummary(normalizedCategories);

  } catch (error) {
    console.error("Error generando reporte", error);
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
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category)
        }
      );
      setEditingCategory(null);
    } else {
      await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
    }
    loadCategories();
  };

  const deleteCategory = async (id) => {
    if (!confirm('¿Eliminar categoría?')) return;
    await fetch(`http://localhost:3001/api/categories/${id}`, {
      method: 'DELETE'
    });
    loadCategories();
  };

  // ===============================
  // MOVIMIENTOS
  // ===============================
  const deleteTransaction = async (id) => {
    if (!confirm('¿Eliminar este movimiento?')) return;
    await fetch(`http://localhost:3001/api/transactions/${id}`, {
      method: 'DELETE'
    });
    loadTransactions();
    loadSummary();
  };

console.log("categorySummary ===>", categorySummary);


  // ===============================
  // RENDER
  // ===============================
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>📊 Contabilidad</h1>

      {/* Resumen general */}
      <Summary summary={summary} />

      {/* Nueva transacción */}
      <TransactionForm onSaved={() => {
        loadTransactions();
        loadSummary();
      }} />

      {/* Categorías */}
      <h2>📁 Categorías</h2>
      <CategoryForm
        onSave={saveCategory}
        editingCategory={editingCategory}
      />

      <CategoriesTable
        categories={categories}
        onEdit={setEditingCategory}
        onDelete={deleteCategory}
      />

      {/* Movimientos */}
      <h2>📄 Movimientos</h2>
      <TransactionsTable
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={setEditingTransaction}
      />

      {/* Reportes */}
      <h2>📊 Reportes</h2>
      <ReportFilters onGenerate={generateReport} />

      

      {monthlySummary && (
        <SummaryChart data={monthlySummary} />
      )}

      {categorySummary.length > 0 ? (
        <CategoryChart data={categorySummary} />
      ) : (
        <p style={{ opacity: 0.6 }}>No hay datos para este período</p>
      )}


     


      {/* Modal edición */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSaved={() => {
            loadTransactions();
            loadSummary();
          }}
        />
      )}
    </div>
  );
}

export default App;
