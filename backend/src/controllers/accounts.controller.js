const pool = require('../database/db');

exports.getAccounts = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT id, name, type, balance
      FROM accounts
      WHERE user_id = $1
      ORDER BY id
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo cuentas' });
  }
};

// 👇 NUEVA FUNCIÓN
exports.createAccount = async (req, res) => {
  const userId = req.user.id;
  const { name, type, balance } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Nombre y tipo requeridos' });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO accounts (name, type, balance, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, type, balance || 0, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando cuenta:', error);
    res.status(500).json({ message: 'Error creando cuenta' });
  }
};




exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, type, balance } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE accounts
      SET name = $1, type = $2, balance = $3
      WHERE id = $4 AND user_id = $5
      RETURNING *
      `,
      [name, type, balance, id, userId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando cuenta:", error);
    res.status(500).json({ message: "Error actualizando cuenta" });
  }
};


exports.deleteAccount = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `DELETE FROM accounts WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json({ message: "Cuenta eliminada" });
  } catch (error) {
    console.error("Error eliminando cuenta:", error);
    res.status(500).json({ message: "Error eliminando cuenta" });
  }
};

