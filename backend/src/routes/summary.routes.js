const router = require('express').Router();

const {
  getSummary,
  getMonthlySummary,
  getCategorySummary
} = require('../controllers/summary.controller');


const authMiddleware = require('../middlewares/auth.middleware');

// 🔐 Todo lo que esté abajo requiere login
router.use(authMiddleware);


router.get('/', getSummary);
router.get('/monthly', getMonthlySummary);
router.get('/category', getCategorySummary);

module.exports = router;
