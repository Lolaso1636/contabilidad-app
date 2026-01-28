const express = require('express');
const cors = require('cors');

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// RUTAS
// ===============================
const authRoutes = require('./routes/auth.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const summaryRoutes = require('./routes/summary.routes');
const categoriesRoutes = require('./routes/categories.routes');
const accountsRoutes = require('./routes/accounts.routes');

// ===============================
// USO DE RUTAS
// ===============================
app.use('/api/auth', authRoutes);          // 👈 FALTABA ESTO
app.use('/api/transactions', transactionsRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/accounts', accountsRoutes);

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
