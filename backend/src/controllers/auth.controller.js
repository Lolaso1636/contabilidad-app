const pool = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}
// ===============================
// REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, passwordhash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email`,
      [name, email, hashedPassword]
    );


    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.passwordhash
    );
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }



    const token = jwt.sign(
      { userId: user.id }, // 👈 aquí el cambio clave
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

