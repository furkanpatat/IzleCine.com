const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// 🔍 Gelişmiş film arama
router.get('/search', movieController.searchMovies);

router.get('/custom', movieController.getCustomMovies);

module.exports = router;
