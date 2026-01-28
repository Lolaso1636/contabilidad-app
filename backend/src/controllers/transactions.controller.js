const pool = require('../database/db');

// ===============================
// CREAR TRANSACCIÓN
// ===============================
exports.createTransaction = async (req, res) => {
  const client = await pool.connect();
  const userId = req.user.id;

  try {
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

    if (type === "INGRESO" && !to_account_id) {
      return res.status(400).json({ message: "Cuenta destino requerida" });
    }

    if (type === "EGRESO" && !from_account_id) {
      return res.status(400).json({ message: "Cuenta origen requerida" });
    }

    if (type === "TRANSFERENCIA" && (!from_account_id || !to_account_id)) {
      return res.status(400).json({ message: "Cuentas origen y destino requeridas" });
    }

    await client.query("BEGIN");

    // VALIDAR CUENTA ORIGEN
    if (type !== "INGRESO") {
      const balanceRes = await client.query(
        `SELECT balance FROM accounts WHERE id = $1 AND user_id = $2`,
        [from_account_id, userId]
      );

      if (!balanceRes.rowCount) {
        throw new Error("Cuenta origen no existe o no pertenece al usuario");
      }

      if (Number(balanceRes.rows[0].balance) < amount) {
        throw new Error("Saldo insuficiente");
      }
    }

    // VALIDAR CUENTA DESTINO
    if (type !== "EGRESO") {
      const destRes = await client.query(
        `SELECT id FROM accounts WHERE id = $1 AND user_id = $2`,
        [to_account_id, userId]
      );

      if (!destRes.rowCount) {
        throw new Error("Cuenta destino no existe o no pertenece al usuario");
      }
    }

    // INSERTAR TRANSACCIÓN
    const { rows } = await client.query(
      `
      INSERT INTO transactions
      (amount, type, description, date, category_id, from_account_id, to_account_id, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        amount,
        type,
        description,
        date,
        category_id,
        from_account_id,
        to_account_id,
        userId
      ]
    );

    // ACTUALIZAR BALANCES
    if (type === "INGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3",
        [amount, to_account_id, userId]
      );
    }

    if (type === "EGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3",
        [amount, from_account_id, userId]
      );
    }

    if (type === "TRANSFERENCIA") {
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3",
        [amount, from_account_id, userId]
      );
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3",
        [amount, to_account_id, userId]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

// ===============================
// OBTENER TRANSACCIONES
// ===============================
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

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
      WHERE t.user_id = $1
      ORDER BY t.date DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener transacciones' });
  }
};

// ===============================
// ELIMINAR TRANSACCIÓN
// ===============================
exports.deleteTransaction = async (req, res) => {
  const client = await pool.connect();
  const userId = req.user.id;
  const { id } = req.params;

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      SELECT amount, type, from_account_id, to_account_id
      FROM transactions
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (!result.rowCount) {
      throw new Error("Transacción no existe o no pertenece al usuario");
    }

    const tx = result.rows[0];
    const amount = Number(tx.amount);

    if (tx.type === "INGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3",
        [amount, tx.to_account_id, userId]
      );
    }

    if (tx.type === "EGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3",
        [amount, tx.from_account_id, userId]
      );
    }

    if (tx.type === "TRANSFERENCIA") {
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3",
        [amount, tx.from_account_id, userId]
      );
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3",
        [amount, tx.to_account_id, userId]
      );
    }

    await client.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    await client.query("COMMIT");
    res.json({ message: "Transacción eliminada correctamente" });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};

// ===============================
// ACTUALIZAR TRANSACCIÓN
// ===============================
exports.updateTransaction = async (req, res) => {
  const client = await pool.connect();
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const {
      amount,
      type,
      description,
      date,
      category_id,
      from_account_id,
      to_account_id
    } = req.body;

    const normalizedType = type.toUpperCase();

    await client.query("BEGIN");

    const oldTxRes = await client.query(
      `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (!oldTxRes.rowCount) {
      throw new Error("Transacción no existe o no pertenece al usuario");
    }

    const old = oldTxRes.rows[0];

    // REVERTIR BALANCES ANTERIORES
    if (old.type === "INGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3",
        [old.amount, old.to_account_id, userId]
      );
    }

    if (old.type === "EGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3",
        [old.amount, old.from_account_id, userId]
      );
    }

    if (old.type === "TRANSFERENCIA") {
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3",
        [old.amount, old.from_account_id, userId]
      );
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3",
        [old.amount, old.to_account_id, userId]
      );
    }

    // ACTUALIZAR TRANSACCIÓN
    await client.query(
      `
      UPDATE transactions SET
        amount = $1,
        type = $2,
        description = $3,
        date = $4,
        category_id = $5,
        from_account_id = $6,
        to_account_id = $7
      WHERE id = $8 AND user_id = $9
      `,
      [
        amount,
        normalizedType,
        description,
        date,
        category_id,
        from_account_id,
        to_account_id,
        id,
        userId
      ]
    );

    // APLICAR NUEVOS BALANCES
    if (normalizedType === "INGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3",
        [amount, to_account_id, userId]
      );
    }

    if (normalizedType === "EGRESO") {
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3",
        [amount, from_account_id, userId]
      );
    }

    if (normalizedType === "TRANSFERENCIA") {
      await client.query(
        "UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND user_id = $3",
        [amount, from_account_id, userId]
      );
      await client.query(
        "UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3",
        [amount, to_account_id, userId]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Transacción actualizada correctamente" });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: error.message });
  } finally {
    client.release();
  }
};
