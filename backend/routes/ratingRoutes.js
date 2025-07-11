const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// Film puanla veya güncelle
router.post('/', ratingController.rateMovie);
// Film için ortalama puan
router.get('/:movieId', ratingController.getAverageRating);
// Kullanıcının bir filme verdiği puan
router.get('/:movieId/:userId', ratingController.getUserRating);

module.exports = router;
