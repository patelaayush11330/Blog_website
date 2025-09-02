const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Registration
router.post('/register', register);

// Login
router.post('/login', login);

// Forgot Password (request reset link)
router.post('/forgot-password', forgotPassword);

// Reset Password (with token)
router.post('/reset-password/:token', resetPassword);

module.exports = router;
