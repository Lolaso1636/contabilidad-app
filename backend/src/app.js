const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Rutas
const transactionsRoutes = require('./routes/transactions.routes');
const summaryRoutes = require('./routes/summary.routes');
const categoriesRoutes = require('./routes/categories.routes');

app.use('/api/transactions', transactionsRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/categories', categoriesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
