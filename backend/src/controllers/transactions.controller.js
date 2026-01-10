const pool = require('../database/db');

// ===============================
// CREAR TRANSACCIÓN
// ===============================
exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, description, date, category_id } = req.body;

    if (!amount || !type || !date || !category_id) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const query = `
      INSERT INTO transactions (amount, type, description, date, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [amount, type, description, date, category_id];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la transacción' });
  }
};

// ===============================
// OBTENER TRANSACCIONES
// ===============================
exports.getTransactions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.name AS category
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener transacciones' });
  }
};

// ===============================
// ELIMINAR TRANSACCIÓN
// ===============================
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM transactions WHERE id = $1',
      [id]
    );

    res.json({ message: 'Transacción eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error eliminando transacción' });
  }
};
// ===============================
// EDITAR TRANSACCIÓN
// ===============================
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, type, description, date, category_id } = req.body;

  try {
    await pool.query(
      `
      UPDATE transactions
      SET amount = $1,
          type = $2,
          description = $3,
          date = $4,
          category_id = $5
      WHERE id = $6
      `,
      [amount, type, description, date, category_id, id]
    );

    res.json({ message: 'Transacción actualizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al editar transacción' });
  }
};
// ===============================
// ACTUALIZAR TRANSACCIÓN
// ===============================
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, description, date, category_id } = req.body;

    if (!amount || !type || !date || !category_id) {
      return res.status(400).json({
        message: 'Datos incompletos'
      });
    }

    const result = await pool.query(
      `
      UPDATE transactions
      SET amount = $1,
          type = $2,
          description = $3,
          date = $4,
          category_id = $5
      WHERE id = $6
      RETURNING *;
      `,
      [amount, type, description, date, category_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error actualizando transacción'
    });
  }
};


