import { MessageSquarePlus } from "lucide-react"; 
import TransactionForm from "../../components/transactions/TransactionForm";
import { useNavigate } from "react-router-dom";

function NewTransaction() {
  const navigate = useNavigate();

  const handleSaved = () => {
    navigate("/transactions");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        <MessageSquarePlus className="w-5 h-5 inline mr-2" /> Nueva transacción</h1>

      <TransactionForm onSaved={handleSaved} />
    </div>
  );
}

export default NewTransaction;
