import { useEffect, useState } from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoriesTable from "../components/categories/CategoriesTable";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await fetch("http://localhost:3001/api/categories");
    const data = await res.json();
    console.log("CATEGORIES EN PAGE:", data);
    setCategories(data);
  };

  const saveCategory = async (category) => {
    await fetch("http://localhost:3001/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });

    loadCategories();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📂 Categorías</h1>

      <CategoryForm
        categories={categories}   // ✅ AHORA SÍ
        onSave={saveCategory}
      />

      <CategoriesTable categories={categories} />
    </div>
  );
}

export default Categories;
