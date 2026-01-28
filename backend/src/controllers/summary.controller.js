const pool = require('../database/db');

// ===============================
// RESUMEN GENERAL
// ===============================
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'INGRESO' THEN amount ELSE 0 END), 0) AS ingresos,
        COALESCE(SUM(CASE WHEN type = 'EGRESO' THEN amount ELSE 0 END), 0) AS egresos
      FROM transactions
      WHERE user_id = $1
    `, [userId]);

    const ingresos = Number(result.rows[0].ingresos);
    const egresos = Number(result.rows[0].egresos);

    res.json({
      ingresos,
      egresos,
      balance: ingresos - egresos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener resumen' });
  }
};



// ===============================
// RESUMEN MENSUAL
// ===============================
exports.getMonthlySummary = async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({
      message: 'Year y month son requeridos'
    });
  }

  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'INGRESO' THEN amount ELSE 0 END), 0) AS ingresos,
        COALESCE(SUM(CASE WHEN type = 'EGRESO' THEN amount ELSE 0 END), 0) AS egresos
      FROM transactions
      WHERE user_id = $1
        AND EXTRACT(YEAR FROM date) = $2
        AND EXTRACT(MONTH FROM date) = $3
      `,
      [userId, year, month]
    );

    const ingresos = Number(result.rows[0].ingresos);
    const egresos = Number(result.rows[0].egresos);

    res.json({
      ingresos,
      egresos,
      balance: ingresos - egresos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error obteniendo resumen mensual'
    });
  }
};


// ===============================
// RESUMEN POR CATEGORÍA
// ===============================
exports.getCategorySummary = async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({
      message: 'Year y month son requeridos'
    });
  }

  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        c.name AS category,
        COALESCE(SUM(t.amount), 0) AS total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
        AND EXTRACT(YEAR FROM t.date) = $2
        AND EXTRACT(MONTH FROM t.date) = $3
      GROUP BY c.name
      ORDER BY total DESC
      `,
      [userId, year, month]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error obteniendo resumen por categoría'
    });
  }
};


