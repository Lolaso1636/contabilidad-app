function CategoryItem({ category, level = 0, onEdit, onDelete }) {
  return (
    <div style={{ marginLeft: level * 20 }} className="mb-2">
      <div className="flex gap-2 items-center">
        <span>📁 {category.name}</span>
        <button onClick={() => onEdit(category)}>✏️</button>
        <button onClick={() => onDelete(category.id)}>🗑️</button>
      </div>

      {category.children?.map(child => (
        <CategoryItem
          key={child.id}
          category={child}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default function CategoryList({ categories, onEdit, onDelete }) {
  return (
    <div className="mt-6">
      {categories.map(cat => (
        <CategoryItem
          key={cat.id}
          category={cat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
