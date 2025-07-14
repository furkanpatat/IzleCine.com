const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const movieController = require('../controllers/movieController');

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'superadmin123') {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid admin credentials' });
});

// Korumalı örnek admin endpoint
router.get('/dashboard', adminAuth, (req, res) => {
  res.json({ message: 'Welcome to admin dashboard!' });
});

// Genel kullanıcı istatistikleri (admin paneli için)
const userController = require('../controllers/userController');
router.get('/user-stats', adminAuth, userController.getGeneralUserStats);
router.get('/users', adminAuth, userController.getAllUsers);
router.delete('/users/:id', adminAuth, userController.deleteUser);

// Yeni film ekleme
router.post('/add-movie', adminAuth, movieController.addMovie);


module.exports = router; 