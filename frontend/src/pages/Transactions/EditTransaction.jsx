import { useParams, useNavigate } from "react-router-dom";
import TransactionForm from "../../components/transactions/TransactionForm";

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSaved = () => {
    navigate("/transactions");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        ✏️ Editar transacción #{id}
      </h1>

      <TransactionForm
        transactionId={id}
        onSaved={handleSaved}
      />
    </div>
  );
}

export default EditTransaction;
