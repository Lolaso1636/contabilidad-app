const pool = require('../database/db');

// ===============================
// OBTENER CATEGORÍAS
// ===============================
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo categorías' });
  }
};

// ===============================
// CREAR CATEGORÍA
// ===============================
exports.createCategory = async (req, res) => {
  try {
    let { name, type, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nombre requerido' });
    }

    // Normalizar parent_id
    parent_id = parent_id ? Number(parent_id) : null;

    // ===== SUBCATEGORÍA =====
    if (parent_id !== null) {
      const parent = await pool.query(
        'SELECT * FROM categories WHERE id = $1',
        [parent_id]
      );

      if (parent.rowCount === 0) {
        return res.status(400).json({ message: 'Categoría padre no existe' });
      }

      const result = await pool.query(
        `INSERT INTO categories (name, type, parent_id)
         VALUES ($1, $2, $3) RETURNING *`,
        [name, parent.rows[0].type, parent_id]
      );

      return res.status(201).json(result.rows[0]);
    }

    // ===== CATEGORÍA PRINCIPAL =====
    const VALID_TYPES = ['INGRESO', 'EGRESO', 'MIXTA'];

    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Tipo inválido' });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, type, parent_id)
         VALUES ($1, $2, $3) RETURNING *`,
      [name, type, null]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando categoría' });
  }
};





// ===============================
// ACTUALIZAR CATEGORÍA
// ===============================
  exports.updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      let { name, type, parent_id } = req.body;

      parent_id = parent_id ? Number(parent_id) : null;

      if (!name || !type) {
        return res.status(400).json({ message: 'Nombre y tipo requeridos' });
      }

      await pool.query(
        `UPDATE categories 
        SET name = $1, type = $2, parent_id = $3 
        WHERE id = $4`,
        [name, type, parent_id, id]
      );

      res.json({ message: 'Categoría actualizada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error actualizando categoría' });
    }
  };


// ===============================
// ELIMINAR CATEGORÍA
// ===============================
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM categories WHERE id = $1',
      [id]
    );

    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando categoría' });
  }
};

// ===============================
// OBTENER ÁRBOL DE CATEGORÍAS
// ===============================
exports.getCategoriesTree = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name'
    );

    const categories = result.rows;

    const map = {};
    const tree = [];

    categories.forEach(cat => {
      map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parent_id) {
        map[cat.parent_id]?.children.push(map[cat.id]);
      } else {
        tree.push(map[cat.id]);
      }
    });

    res.json(tree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo árbol de categorías' });
  }
};
// ===============================
// FIN CONTROLADOR CATEGORÍAS
// ===============================
