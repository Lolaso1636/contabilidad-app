const pool = require('../database/db');

exports.getAccounts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, balance
      FROM accounts
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo cuentas' });
  }
};
