import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TransactionsTable from "../../components/transactions/TransactionsTable";

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/transactions")
      .then(res => res.json())
      .then(setTransactions);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📄 Transacciones</h1>

        <Link
          to="/transactions/new"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          ➕ Nueva
        </Link>
      </div>

      <TransactionsTable
        transactions={transactions}
        showActions
      />
    </div>
  );
}

export default TransactionsList;
