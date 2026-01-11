import Summary from "../components/Summary";
import TransactionForm from "../components/TransactionForm";

function Dashboard() {
  return (
    <>
      <h1>📊 Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem"
        }}
      >
        {/* Resumen */}
        <div style={card}>
          <Summary />
        </div>

        {/* Nueva transacción */}
        <div style={card}>
          <h3>➕ Nueva transacción</h3>
          <TransactionForm />
        </div>
      </div>
    </>
  );
}

const card = {
  background: "white",
  padding: "1.5rem",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

export default Dashboard;
