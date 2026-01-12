import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText, Pencil, Trash2 } from "lucide-react";

/**
 * Construye el árbol
 */
function buildCategoryTree(categories) {
  const map = {};
  const roots = [];

  categories.forEach(c => {
    map[c.id] = { ...c, children: [] };
  });

  categories.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}

/**
 * Nodo del árbol
 */
  function CategoryNode({ category, level = 0, onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const hasChildren = category.children.length > 0;

    const typeColor =
      category.type === "INGRESO"
        ? "bg-green-600/20 text-green-400"
        : category.type === "EGRESO"
        ? "bg-red-600/20 text-red-400"
        : "bg-yellow-600/20 text-yellow-400";

    return (
      <div>
        <div
          className="flex items-center gap-2 py-2 px-2 hover:bg-gray-800 rounded cursor-pointer"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {/* Expand */}
          {hasChildren ? (
            <button onClick={() => setOpen(!open)}>
              {open ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* Icon */}
          {hasChildren ? (
            <Folder className="w-4 h-4 text-yellow-400" />
          ) : (
            <FileText className="w-4 h-4 text-slate-400" />
          )}

          {/* Nombre */}
            <div className="flex-1">
              {category.name}
            </div>

            {/* Tipo (columna centrada real) */}
            <div className="w-32 flex justify-center">
              <span className={`text-xs px-2 py-0.5 rounded ${typeColor}`}>
                {category.type}
              </span>
            </div>

            {/* Acciones */}
            <div className="w-20 flex justify-end gap-2">
              <button onClick={() => onEdit(category)}>
                <Pencil className="w-7 h-4 text-blue-400" />
              </button>

              <button onClick={() => onDelete(category.id)}>
                <Trash2 className="w-5 h-4 text-red-400" />
              </button>
            </div>
           </div>

        {/* Children */}
        {open &&
          category.children.map(child => (
            <CategoryNode
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


/**
 * Vista principal
 */
export default function CategoriesTree({ categories, onEdit, onDelete }) {
  const tree = buildCategoryTree(categories);

  return (
    <div className="bg-gray-900 text-slate-200 rounded-xl p-5 mt-6">
      <h3 className="text-lg font-semibold mb-4">📂 Categorías</h3>

      {tree.map(cat => (
        <CategoryNode
          key={cat.id}
          category={cat}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
