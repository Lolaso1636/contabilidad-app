import ReportFilters from "../components/ReportFilters";
import SummaryChart from "../components/SummaryChart";
import CategoryChart from "../components/CategoryChart";

function Reports() {
  return (
    <>
      <h1>📈 Reportes</h1>

      <div style={card}>
        <ReportFilters />
      </div>

      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div style={card}>
          <SummaryChart />
        </div>

        <div style={card}>
          <CategoryChart />
        </div>
      </div>
    </>
  );
}

const card = {
  background: "white",
  padding: "1.5rem",
  borderRadius: "8px",
  flex: 1
};

export default Reports;
