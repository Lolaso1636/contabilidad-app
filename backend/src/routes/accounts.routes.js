const express = require('express');
const router = express.Router();
const {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount
} = require('../controllers/accounts.controller');


const authMiddleware = require('../middlewares/auth.middleware');

// 🔐 Todo lo que esté abajo requiere login
router.use(authMiddleware);

router.get('/', getAccounts);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;