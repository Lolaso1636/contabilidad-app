const express = require('express');
const router = express.Router();

const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  
} = require('../controllers/transactions.controller');

router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);
router.put('/:id', updateTransaction);


module.exports = router;
