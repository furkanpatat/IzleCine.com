const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const sendToQueue = require('../sendMailJob');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  console.log('Register request received:', { body: req.body });
  
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, email, password } = req.body;
    console.log('Processing registration for:', { username, email });
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', { email, username });
      return res.status(400).json({ message: 'Username or email already registered.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    console.log('User created successfully:', { userId: user._id, username: user.username });
    
    // Generate token for the newly registered user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    
    const response = { 
      message: 'Registration successful!',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
    
    console.log('Sending registration response:', { ...response, token: '***' });
    res.status(201).json(response);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // 🌟 Öncelikle admin kontrolü yapalım
    if (email === 'admin@admin.com' && password === 'superadmin123') {
      console.log('--- ADMIN GİRİŞİ ---');
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secretkey', {
        expiresIn: '1d'
      });

      return res.json({
        token,
        user: {
          username: 'admin',
          email: 'admin@admin.com',
          role: 'admin'
        },
        redirectTo: '/admin'
      });
    }

    // 🟡 Sadece normal kullanıcılar için log ve MongoDB işlemleri
    console.log('--- LOGIN DENEMESİ BAŞLANGICI ---');
    console.log('Giriş denemesi için e-posta:', email);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('Kullanıcı bulunamadı:', email);
      return res.status(400).json({ message: 'Email veya şifre yanlış.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Şifreler eşleşmedi.');
      return res.status(400).json({ message: 'Email veya şifre yanlış.' });
    }

    console.log('Şifre eşleşti, giriş başarılı!');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1d'
    });

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role || 'user'
      },
      redirectTo: user.role === 'admin' ? '/admin' : '/'
    });

  } catch (err) {
    console.error('Login error:', err);
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
      console.log('maili kontrol ediyor')
      return res.status(400).json({ message: 'E-posta adresi gerekli.' });
    }

    // Kullanıcının veritabanında olup olmadığını kontrol et
    const user = await User.findOne({ email });
    if (!user) {
      console.log('kullanıcıyı kontrol ediyor')
      return res.status(404).json({ message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.' });
    }

    // Şifre sıfırlama token'ı oluştur (1 saat geçerli)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' },
      
    );
    console.log('Şifre sıfırlama tokeni oluştu')

    // Şifre sıfırlama linkini oluştur
    const resetLink = `http://localhost:3000/password-reset?token=${resetToken}`;

    // E-posta gönderme işlemini kuyruğa ekle
    const mailData = {
      email: email,
      resetLink: resetLink
    };
    console.log('📨 Mail kuyruğuna gönderilen veri:', mailData);

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
    console.log('✅ Token çözüldü. Kullanıcı ID:', decoded.userId);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

     console.log('👤 Kullanıcı bulundu:', user.email);
    console.log('Eski şifre (DB\'den):', user.password); // Mevcut şifreyi de loglayalım
    console.log('Yeni gelen şifre (plain):', newPassword);

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Hashlenmiş şifre:', hashedPassword);

    // Güncelle ve kaydet
    user.password = hashedPassword;
    try {
      await user.save();
      console.log('💾 Yeni şifre başarıyla MongoDB\'ye kaydedildi. Kaydedilen hash:', user.password);
    } catch (saveError) {
      console.error('❌ Şifre kaydetme sırasında Mongoose hatası:', saveError);
      return res.status(500).json({ message: 'Şifre güncellenirken veritabanı hatası oluştu.' });
    }

    return res.status(200).json({ message: 'Şifreniz başarıyla sıfırlandı.' });

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }
    console.error('❌ Reset password error:', err);
    return res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
};


// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    console.log('Update profile request received:', { body: req.body, userId: req.user.userId });
    
    const { username, city, theme, language, firstName, lastName, birthYear, bio, favoriteGenres, photo } = req.body;
    const userId = req.user.userId;

    // Username benzersizliği kontrolü
    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: userId } });
      if (existing) {
        console.log('Username already exists:', username);
        return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
      }
    }

    // Sadece gönderilen alanları güncelle
    const updateFields = {};
    if (username) updateFields.username = username;
    if (city !== undefined) updateFields.city = city;
    if (theme) updateFields.theme = theme;
    if (language) updateFields.language = language;
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (birthYear !== undefined) {
      // Validate birthYear
      const currentYear = new Date().getFullYear();
      if (birthYear < 1900 || birthYear > currentYear) {
        console.log('Invalid birthYear:', birthYear);
        return res.status(400).json({ message: `Doğum yılı 1900 ile ${currentYear} arasında olmalıdır.` });
      }
      updateFields.birthYear = birthYear;
    }
    if (bio !== undefined) updateFields.bio = bio;
    if (photo !== undefined) updateFields.photo = photo;
    if (favoriteGenres !== undefined) updateFields.favoriteGenres = favoriteGenres;
    
    console.log('Update fields:', updateFields);
    
    // Use findByIdAndUpdate with runValidators: false to avoid validation issues
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: false }
    ).select('-password');

    if (!updatedUser) {
      console.log('User not found for update:', userId);
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('Profile updated successfully:', { userId: updatedUser._id, username: updatedUser.username });
    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// Get comments by user
exports.getUserComments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Get comments from Comment collection for better data structure
    const comments = await Comment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Format comments for frontend
    const formattedComments = comments.map(comment => ({
      id: comment._id,
      content: comment.content,
      movieId: comment.movieId,
      movieTitle: comment.movieTitle || 'Movie',
      commentedAt: comment.createdAt,
      rating: comment.rating
    }));

    res.json(formattedComments);
  } catch (err) {
    console.error('Get user comments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add movie to watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    console.log('Add to watchlist request received:', { body: req.body, userId: req.user.userId });
    
    const { movieId } = req.body;
    const userId = req.user.userId;

    if (!movieId) {
      console.log('Missing movieId in request');
      return res.status(400).json({ message: 'movieId is required.' });
    }

    console.log('Looking for user with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('User found:', { userId: user._id, username: user.username });
    console.log('Current watchlist:', user.watchlist);

    const alreadyExists = user.watchlist.some(item => item.movieId.toString() == movieId.toString());
    if (alreadyExists) {
      console.log('Movie already in watchlist:', movieId);
      return res.status(400).json({ message: 'Film zaten izleme listesinde.' });
    }

    user.watchlist.push({ movieId, addedAt: new Date() });
    await user.save();

    console.log('Movie added to watchlist successfully:', { movieId, userId: user._id });
    res.status(200).json({ message: 'Film izleme listesine eklendi.' });
  } catch (err) {
    console.error('Add to watchlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.watchlist || []);
  } catch (err) {
    console.error('Get watchlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add liked movie
exports.addLikedMovie = async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'movieId is required.' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { likedMovies: { movieId, likedAt: new Date() } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.likedMovies);
  } catch (err) {
    console.error('Add liked movie error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get liked movies
exports.getLikedMovies = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.likedMovies || []);
  } catch (err) {
    console.error('Get liked movies error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Delete user's comments
    await Comment.deleteMany({ userId: req.user.userId });

    // Delete user account
    await User.findByIdAndDelete(req.user.userId);

    res.json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove movie from watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(400).json({ message: 'movieId is required.' });
    }
    const userId = req.user.userId; 
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: { movieId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user.watchlist || []);
  } catch (err) {
    console.error('Remove from watchlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Count comments
    const commentCount = await Comment.countDocuments({ userId });

    // Get watchlist count
    const watchlistCount = user.watchlist ? user.watchlist.length : 0;

    // Get liked movies count
    const likedMoviesCount = user.likedMovies ? user.likedMovies.length : 0;

    // Get average rating if ratings exist
    let averageRating = 0;
    if (user.ratings && user.ratings.size > 0) {
      const ratings = Array.from(user.ratings.values());
      averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    }

    const stats = {
      commentCount,
      watchlistCount,
      likedMoviesCount,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: user.ratings ? user.ratings.size : 0,
      memberSince: user.createdAt
    };

    res.json(stats);
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 

// Admin için genel kullanıcı istatistikleri
exports.getGeneralUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const newSignups = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    // Aktif kullanıcıyı basitçe son 7 gün içinde giriş yapanlar olarak varsayalım (örnek, login log yoksa yeni kayıtlar gibi dönecek)
    // Eğer User modelinde lastLogin gibi bir alan yoksa, aktif kullanıcıyı newSignups ile aynı döneceğiz
    res.json({
      totalUsers,
      newSignups,
      activeUsers: newSignups // lastLogin yoksa newSignups ile aynı
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 

// Admin için tüm kullanıcıları dönen endpoint
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 

// Admin için kullanıcı silme
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // İlgili kullanıcının yorumlarını da silebilirsin (opsiyonel)
    await Comment.deleteMany({ userId });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 