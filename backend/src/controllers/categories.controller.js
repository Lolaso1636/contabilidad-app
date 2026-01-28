const pool = require('../database/db');

// ===============================
// OBTENER CATEGORÍAS
// ===============================
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
      [userId]
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
    const userId = req.user.id;
    let { name, type, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nombre requerido' });
    }

    parent_id = parent_id ? Number(parent_id) : null;

    // ===== SUBCATEGORÍA =====
    if (parent_id !== null) {
      const parent = await pool.query(
        'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
        [parent_id, userId]
      );

      if (parent.rowCount === 0) {
        return res.status(400).json({ message: 'Categoría padre no existe' });
      }

      const result = await pool.query(
        `INSERT INTO categories (name, type, parent_id, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, parent.rows[0].type, parent_id, userId]
      );

      return res.status(201).json(result.rows[0]);
    }

    // ===== CATEGORÍA PRINCIPAL =====
    const VALID_TYPES = ['INGRESO', 'EGRESO', 'MIXTA'];

    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Tipo inválido' });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, type, parent_id, user_id)
       VALUES ($1, $2, NULL, $3)
       RETURNING *`,
      [name, type, userId]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("ERROR CREANDO CATEGORÍA:", error);
    res.status(500).json({ message: error.message });
  }
};






// ===============================
// ACTUALIZAR CATEGORÍA
// ===============================
  exports.updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      let { name, type, parent_id } = req.body;

      parent_id = parent_id ? Number(parent_id) : null;

      if (!name || !type) {
        return res.status(400).json({ message: 'Nombre y tipo requeridos' });
      }

      const result = await pool.query(
        `UPDATE categories 
        SET name = $1, type = $2, parent_id = $3 
        WHERE id = $4 AND user_id = $5
        RETURNING *`,
        [name, type, parent_id, id, userId]
      );

      if (!result.rowCount) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      res.json(result.rows[0]);
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
      const userId = req.user.id;

      const result = await pool.query(
        'DELETE FROM categories WHERE id = $1 AND user_id = $2',
        [id, userId]
      );

      if (!result.rowCount) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      res.json({ message: 'Categoría eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error eliminando categoría' });
    }
  }

// ===============================
// OBTENER ÁRBOL DE CATEGORÍAS
// ===============================
exports.getCategoriesTree = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
      [userId]
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
