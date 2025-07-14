const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: String,
  year: Number,
  director: String,
  description: String,
  posterUrl: String,
  duration: Number,
  rating: Number,
  cast: [String],
  language: String,
  country: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
