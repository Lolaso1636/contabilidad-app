const express = require('express');
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesTree
} = require('../controllers/categories.controller');

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/tree', getCategoriesTree);



module.exports = router;
