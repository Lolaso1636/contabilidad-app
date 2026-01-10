const router = require('express').Router();

const {
  getSummary,
  getMonthlySummary,
  getCategorySummary
} = require('../controllers/summary.controller');

router.get('/', getSummary);
router.get('/monthly', getMonthlySummary);
router.get('/category', getCategorySummary);

module.exports = router;
