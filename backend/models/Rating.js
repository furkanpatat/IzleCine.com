const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: String, // TMDb'den gelen film ID genelde string olur
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
