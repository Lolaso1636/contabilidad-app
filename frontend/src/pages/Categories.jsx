import CategoryForm from "../components/CategoryForm";
import CategoriesTable from "../components/CategoriesTable";

function Categories() {
  return (
    <>
      <h1>📁 Categorías</h1>

      <div style={card}>
        <CategoryForm />
      </div>

      <div style={{ ...card, marginTop: "2rem" }}>
        <CategoriesTable />
      </div>
    </>
  );
}

const card = {
  background: "white",
  padding: "1.5rem",
  borderRadius: "8px"
};

export default Categories;
