const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  city: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  likedMovies: [
    {
      movieId: { type: String, required: true },
      likedAt: { type: Date, default: Date.now }
    }
  ],
  watchlist: [
    {
      movieId: { type: String, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  comments: [
    {
      movieId: { type: String, required: true },
      commentText: { type: String },
      commentedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', userSchema); 