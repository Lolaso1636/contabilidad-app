const pool = require('../database/db');

exports.getAccounts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, type, balance
      FROM accounts
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo cuentas' });
  }
};

// 👇 NUEVA FUNCIÓN
exports.createAccount = async (req, res) => {
  const { name, type, balance } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO accounts (name, type, balance)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, type, balance]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando cuenta:', error);
    res.status(500).json({ message: 'Error creando cuenta' });
  }
};



exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  const { name, type, balance } = req.body;

  try {
    const result = await pool.query(
      `UPDATE accounts
       SET name = $1, type = $2, balance = $3
       WHERE id = $4
       RETURNING *`,
      [name, type, balance, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando cuenta:", error);
    res.status(500).json({ message: "Error actualizando cuenta" });
  }
};

exports.deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM accounts WHERE id = $1`, [id]);
    res.json({ message: "Cuenta eliminada" });
  } catch (error) {
    console.error("Error eliminando cuenta:", error);
    res.status(500).json({ message: "Error eliminando cuenta" });
  }
};
