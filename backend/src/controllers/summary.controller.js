const pool = require('../database/db');

// ===============================
// RESUMEN GENERAL
// ===============================
exports.getSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        SUM(CASE WHEN type = 'INGRESO' THEN amount ELSE 0 END) AS ingresos,
        SUM(CASE WHEN type = 'EGRESO' THEN amount ELSE 0 END) AS egresos
      FROM transactions
    `);

    const ingresos = Number(result.rows[0].ingresos) || 0;
    const egresos = Number(result.rows[0].egresos) || 0;

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
    const result = await pool.query(
      `
      SELECT
        SUM(CASE WHEN type = 'INGRESO' THEN amount ELSE 0 END) AS ingresos,
        SUM(CASE WHEN type = 'EGRESO' THEN amount ELSE 0 END) AS egresos
      FROM transactions
      WHERE EXTRACT(YEAR FROM date) = $1
        AND EXTRACT(MONTH FROM date) = $2
      `,
      [year, month]
    );

    const ingresos = Number(result.rows[0].ingresos) || 0;
    const egresos = Number(result.rows[0].egresos) || 0;

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
    const result = await pool.query(
      `
      SELECT
        c.name AS category,
        SUM(t.amount) AS total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE EXTRACT(YEAR FROM t.date) = $1
        AND EXTRACT(MONTH FROM t.date) = $2
      GROUP BY c.name
      ORDER BY total DESC
      `,
      [year, month]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error obteniendo resumen por categoría'
    });
  }
};
