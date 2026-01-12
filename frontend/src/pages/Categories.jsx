import { useEffect, useState } from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoriesTable from "../components/categories/CategoriesTable";


function Categories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadCategories = () => {
    fetch("http://localhost:3001/api/categories")
      .then(res => res.json())
      .then(setCategories);
  };

  useEffect(loadCategories, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📂 Categorías</h1>

      <CategoryForm
        editingCategory={editing}
        onSave={() => {
          setEditing(null);
          loadCategories();
        }}
      />

      <CategoriesTable
        categories={categories}
        onEdit={setEditing}
        onDelete={loadCategories}
      />
    </div>
  );
}

export default Categories;
