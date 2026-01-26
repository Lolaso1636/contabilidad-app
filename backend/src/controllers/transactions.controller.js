const pool = require('../database/db');

// ===============================
// CREAR TRANSACCIÓN
// ===============================
exports.createTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
    console.log("BODY RECIBIDO:", req.body);

    let {
      amount,
      type,
      description,
      date,
      category_id,
      from_account_id,
      to_account_id
    } = req.body;

    amount = Number(amount);
    category_id = category_id ? Number(category_id) : null;
    from_account_id = from_account_id ? Number(from_account_id) : null;
    to_account_id = to_account_id ? Number(to_account_id) : null;
    type = type.toUpperCase();

    if (!["INGRESO", "EGRESO", "TRANSFERENCIA"].includes(type)) {
      return res.status(400).json({ message: "Tipo inválido" });
    }

    await client.query("BEGIN");

    // VALIDAR SALDO
    if (type !== "INGRESO") {
      if (!from_account_id) throw new Error("Cuenta origen requerida");

      const { rows } = await client.query(
        "SELECT balance FROM accounts WHERE id = $1",
        [from_account_id]
      );

      if (!rows.length) throw new Error("Cuenta origen no existe");
      if (Number(rows[0].balance) < amount) throw new Error("Saldo insuficiente");
    }

    if (type !== "EGRESO" && !to_account_id) {
      throw new Error("Cuenta destino requerida");
    }

    // INSERT
    const { rows } = await client.query(
      `
      INSERT INTO transactions
      (amount, type, description, date, category_id, from_account_id, to_account_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [amount, type, description, date, category_id, from_account_id, to_account_id]
    );

    // BALANCES
    if (type === "INGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
        [amount, to_account_id]
      );
    }

    if (type === "EGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
        [amount, from_account_id]
      );
    }

    if (type === "TRANSFERENCIA") {
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
        [amount, from_account_id]
      );
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
        [amount, to_account_id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ERROR CREATE TRANSACTION:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};









// ===============================
// OBTENER TRANSACCIONES
// ===============================
exports.getTransactions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.*,
        c.name AS category,
        fa.name AS from_account,
        ta.name AS to_account
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts fa ON t.from_account_id = fa.id
      LEFT JOIN accounts ta ON t.to_account_id = ta.id
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
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // 1️⃣ OBTENER TRANSACCIÓN
    const result = await client.query(
      `SELECT amount, type, from_account_id, to_account_id
       FROM transactions
       WHERE id = $1`,
      [id]
    );

    if (!result.rowCount) {
      throw new Error("Transacción no existe");
    }

    const tx = result.rows[0];
    const amount = Number(tx.amount);
    const type = tx.type;

    // 2️⃣ REVERTIR BALANCES
    if (type === "INGRESO") {
      await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
        [amount, tx.to_account_id]
      );
    }

    if (type === "EGRESO") {
      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [amount, tx.from_account_id]
      );
    }

    if (type === "TRANSFERENCIA") {
      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [amount, tx.from_account_id]
      );

      await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
        [amount, tx.to_account_id]
      );
    }

    // 3️⃣ BORRAR TRANSACCIÓN
    await client.query(
      `DELETE FROM transactions WHERE id = $1`,
      [id]
    );

    await client.query("COMMIT");

    res.json({ message: "Transacción eliminada correctamente" });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({
      message: "Error eliminando transacción",
      error: error.message
    });
  } finally {
    client.release();
  }
};


// ===============================
// EDITAR TRANSACCIÓN
// ===============================

// ===============================
// ACTUALIZAR TRANSACCIÓN
// ===============================
exports.updateTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const {
      amount,
      type,
      description,
      date,
      category_id,
      from_account_id,
      to_account_id
    } = req.body;

    

    await client.query('BEGIN');

    // 1️⃣ Obtener transacción anterior
    const oldTxRes = await client.query(
      `SELECT * FROM transactions WHERE id = $1`,
      [id]
    );

    if (!oldTxRes.rowCount) {
      throw new Error('Transacción no existe');
    }

    const old = oldTxRes.rows[0];

    // 2️⃣ Revertir balances antiguos
    if (old.type === 'INGRESO') {
      await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
        [old.amount, old.to_account_id]
      );
    }

    if (old.type === 'EGRESO') {
      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [old.amount, old.from_account_id]
      );
    }

    if (old.type === 'TRANSFERENCIA') {
      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [old.amount, old.from_account_id]
      );
      await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
        [old.amount, old.to_account_id]
      );
    }

    // 3️⃣ Validar saldo para nueva transacción
    if (normalizedType === 'EGRESO' || normalizedType === 'TRANSFERENCIA') {
      const balanceRes = await client.query(
        `SELECT balance FROM accounts WHERE id = $1`,
        [from_account_id]
      );

      if (!balanceRes.rowCount) {
        throw new Error('Cuenta origen no existe');
      }

      if (balanceRes.rows[0].balance < amount) {
        throw new Error('Saldo insuficiente');
      }
    }

    // 4️⃣ Actualizar transacción
    await client.query(
      `UPDATE transactions SET
        amount = $1,
        type = $2,
        description = $3,
        date = $4,
        category_id = $5,
        from_account_id = $6,
        to_account_id = $7
      WHERE id = $8`,
      [
        amount,
        normalizedType,
        description,
        date,
        category_id,
        from_account_id,
        to_account_id,
        id
      ]
    );

    // 5️⃣ Aplicar balances nuevos
    if (normalizedType === 'INGRESO') {
      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [amount, to_account_id]
      );
    }

    if (normalizedType === 'EGRESO') {
      await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
        [amount, from_account_id]
      );
    }

    if (normalizedType === 'TRANSFERENCIA') {
      await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
        [amount, from_account_id]
      );
      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [amount, to_account_id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Transacción actualizada correctamente' });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({
      message: 'Error actualizando transacción',
      error: error.message
    });
  } finally {
    client.release();
  }
};





