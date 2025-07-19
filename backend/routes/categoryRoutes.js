const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const adminAuth = require('../middleware/adminAuth'); // Geri getirildi

// Kategori route'ları
router.get('/popular', categoryController.getPopularMovies);
router.get('/trending', categoryController.getTrendingMovies);
router.get('/genre/:genreId', categoryController.getMoviesByGenre);
router.get('/all', categoryController.getAllCategories);

// Admin route'ları (cache temizleme) - admin auth geri getirildi
router.delete('/cache', adminAuth, categoryController.clearCategoryCache);

module.exports = router; 