const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.register); // /api/users
router.post('/login', userController.login); // /api/login

module.exports = router; 