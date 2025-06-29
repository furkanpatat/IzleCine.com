const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const sendToQueue = require('../sendMailJob');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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

// Forgot Password - Şifre sıfırlama e-postası gönderme
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // E-posta adresinin geçerli olup olmadığını kontrol et
    if (!email) {
      return res.status(400).json({ message: 'E-posta adresi gerekli.' });
    }

    // Kullanıcının veritabanında olup olmadığını kontrol et
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.' });
    }

    // Şifre sıfırlama token'ı oluştur (1 saat geçerli)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    // Şifre sıfırlama linkini oluştur
    const resetLink = `http://localhost:3000/password-reset?token=${resetToken}`;

    // E-posta gönderme işlemini kuyruğa ekle
    const mailData = {
      email: email,
      resetLink: resetLink
    };

    await sendToQueue(mailData);

    res.status(200).json({ 
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' 
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
};

// Reset Password - Token ile şifre sıfırlama
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token ve yeni şifre gerekli.' });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Yeni şifreyi hash'le
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Kullanıcının şifresini güncelle
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Şifreniz başarıyla sıfırlandı.' });

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
}; 