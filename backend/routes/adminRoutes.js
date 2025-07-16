const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const movieController = require('../controllers/movieController');
const userController = require('../controllers/userController');
const commentController = require('../controllers/commentController');
const ratingController = require('../controllers/ratingController');

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
router.get('/user-stats', adminAuth, userController.getGeneralUserStats);
router.get('/users', adminAuth, userController.getAllUsers);

//Kullanıcı silme
router.delete('/users/:id', adminAuth, userController.deleteUser);

// Yeni film ekleme
router.post('/add-movie', adminAuth, movieController.addMovie);

router.get('/all-movies', adminAuth, movieController.getAllMovies);
router.delete('/delete-movie/:id', adminAuth, movieController.deleteMovie);

// Genel istatistikler (admin paneli için)
router.get('/general-stats', adminAuth, async (req, res) => {
  try {
    const [userStats, movieStats, commentStats, ratingStats] = await Promise.all([
      userController.getGeneralUserStatsPromise(),
      require('../controllers/movieController').getMovieStatsPromise(),
      commentController.getCommentStatsPromise(),
      ratingController.getGlobalRatingStatsPromise()
    ]);
    res.json({
      ...userStats,
      ...movieStats,
      ...commentStats,
      ...ratingStats
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 