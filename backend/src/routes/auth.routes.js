const express = require('express');
const router = express.Router();

const {
  register,
  login
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);

// routes/auth.routes.js
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: 'Token válido',
    user: req.user
  });
});


module.exports = router;
