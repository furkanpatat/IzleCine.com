const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Kullanıcı adı veya email zaten kayıtlı.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Kayıt başarılı.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// 1. Kullanıcı yorum yaptığında
exports.addUserComment = async (req, res) => {
  try {
    const { userId, movieId, content } = req.body;
    if (!userId || !movieId || !content) {
      return res.status(400).json({ message: 'Eksik bilgi.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    const comment = new Comment({ userId, movieId, content });
    await comment.save();
    await User.findByIdAndUpdate(userId, {
      $push: { comments: { movieId, commentText: content, commentedAt: new Date() } }
    });
    return res.status(201).json({ message: 'Yorum eklendi.', comment });
  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası.', error: err.message });
  }
};

// 2. Kullanıcı bir filmi favorilere eklediğinde
exports.addFavoriteMovie = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    if (!userId || !movieId) {
      return res.status(400).json({ message: 'Eksik bilgi.' });
    }
    const update = {
      $addToSet: { likedMovies: { movieId, likedAt: new Date() } }
    };
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    return res.status(200).json({ message: 'Film favorilere eklendi.', likedMovies: user.likedMovies });
  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası.', error: err.message });
  }
};

// 3. Kullanıcı bir filme puan verdiğinde
exports.rateMovie = async (req, res) => {
  try {
    const { userId, movieId, rating } = req.body;
    if (!userId || !movieId || typeof rating !== 'number') {
      return res.status(400).json({ message: 'Eksik veya hatalı bilgi.' });
    }
    // ratings alanı User modelinde yoksa, eklenmesi gerekir. Burada ratings: Map olarak varsayılmıştır.
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    if (!user.ratings) user.ratings = new Map();
    user.ratings.set(movieId, rating);
    await user.save();
    return res.status(200).json({ message: 'Puan kaydedildi.', ratings: Object.fromEntries(user.ratings) });
  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası.', error: err.message });
  }
}; 