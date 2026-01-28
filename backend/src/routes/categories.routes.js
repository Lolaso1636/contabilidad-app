const express = require('express');
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesTree
} = require('../controllers/categories.controller');

const authMiddleware = require('../middlewares/auth.middleware');

// 🔐 Todo lo que esté abajo requiere login
router.use(authMiddleware);

router.get('/tree', getCategoriesTree);
router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);




module.exports = router;
