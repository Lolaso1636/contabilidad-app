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
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: 'Nombre y tipo requeridos'
      });
    }

    const VALID_TYPES = ['INGRESO', 'EGRESO', 'MIXTA'];

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        message: `Tipo inválido. Use: ${VALID_TYPES.join(', ')}`
      });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, type) VALUES ($1, $2) RETURNING *',
      [name, type]
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
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Nombre y tipo requeridos' });
    }

    await pool.query(
      'UPDATE categories SET name = $1, type = $2 WHERE id = $3',
      [name, type, id]
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
