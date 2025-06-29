const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.register); // /api/users
router.post('/login', userController.login); // /api/users/login
router.post('/forgot-password', userController.forgotPassword); // /api/users/forgot-password
router.post('/reset-password', userController.resetPassword); // /api/users/reset-password

module.exports = router; 