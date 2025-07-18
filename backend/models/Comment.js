const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: false },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 10, required: false },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  votes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      type: { type: String, enum: ['like', 'dislike'] }
    }
  ],
  reported: { type: Boolean, default: false } // Yorumun raporlanıp raporlanmadığını belirtir
});

module.exports = mongoose.model('Comment', commentSchema); 