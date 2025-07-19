const Comment = require('../models/Comment');
const User = require('../models/User');

exports.addComment = async (req, res) => {
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

    // Yeni yorumu populate ederek döndür
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username profileImage');

    res.status(201).json({
      message: 'Yorum eklendi.',
      comment: populatedComment
    });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

exports.getCommentsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user?.userId;
    const comments = await Comment.find({ movieId })
      .populate('userId', 'username profileImage')
      .sort({ createdAt: -1 }); // En yeni yorumlar üstte
    const commentsWithUserVote = comments.map(comment => {
      let userVote = null;
      if (userId && comment.votes && comment.votes.length > 0) {
        const found = comment.votes.find(v => v.userId && v.userId.toString() === userId);
        if (found) userVote = found.type;
      }
      return {
        ...comment.toObject(),
        userVote
      };
    });
    res.json(commentsWithUserVote);
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // JWT'den gelen kullanıcı ID'si

    // Yorumu bul ve kullanıcının kendi yorumu olup olmadığını kontrol et
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    // Kullanıcının kendi yorumu mu kontrol et
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Bu yorumu silme yetkiniz yok.' });
    }

    // Yorumu sil
    await Comment.findByIdAndDelete(id);

    res.json({ message: 'Yorum başarıyla silindi.' });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; // JWT'den gelen kullanıcı ID'si

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Yorum içeriği boş olamaz.' });
    }

    // Yorumu bul ve kullanıcının kendi yorumu olup olmadığını kontrol et
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }

    // Kullanıcının kendi yorumu mu kontrol et
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Bu yorumu düzenleme yetkiniz yok.' });
    }

    // Yorumu güncelle
    comment.content = content.trim();
    comment.updatedAt = new Date();
    await comment.save();

    // Güncellenmiş yorumu populate ederek döndür
    const updatedComment = await Comment.findById(id).populate('userId', 'username profileImage');

    res.json({ 
      message: 'Yorum başarıyla güncellendi.',
      comment: updatedComment
    });
  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

exports.getCommentStats = async (req, res) => {
  try {
    const totalReviews = await Comment.countDocuments();
    res.json({ totalReviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCommentStatsPromise = async () => {
  const totalReviews = await Comment.countDocuments();
  return { totalReviews };
};

exports.voteComment = async (req, res) => {
  try {
    const { id, type } = req.params; // id: commentId, type: 'like' | 'dislike'
    const userId = req.user.userId;
    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ message: 'Geçersiz oy tipi.' });
    }
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }
    // Kullanıcının daha önce oy verip vermediğini kontrol et
    const existingVote = comment.votes.find(v => v.userId.toString() === userId);
    if (existingVote) {
      if (existingVote.type === type) {
        return res.status(400).json({ message: 'Zaten oy verdiniz.' });
      }
      // Oyunu değiştiriyorsa eskiyi sil, yenisini ekle
      comment.votes = comment.votes.filter(v => v.userId.toString() !== userId);
    }
    // Yeni oyu ekle
    comment.votes.push({ userId, type });
    // Like/dislike sayılarını güncelle
    comment.likes = comment.votes.filter(v => v.type === 'like').length;
    comment.dislikes = comment.votes.filter(v => v.type === 'dislike').length;
    await comment.save();
    res.json({ likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    console.error('Vote comment error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

exports.reportComment = async (req, res) => {
  try {
    const { id } = req.params; // Yorumun ID'si
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }
    comment.reported = true;
    await comment.save();
    res.json({ message: 'Yorum başarıyla raporlandı.' });
  } catch (err) {
    console.error('Report comment error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Sadece raporlanan yorumları getirir (admin için)
exports.getReportedComments = async (req, res) => {
  try {
    const reportedComments = await Comment.find({ reported: true }).populate('userId', 'username profileImage');
    res.json(reportedComments);
  } catch (err) {
    console.error('Get reported comments error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Adminin yorumu silmesi için fonksiyon (tamamen siler)
exports.adminDeleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı.' });
    }
    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Yorum başarıyla silindi.' });
  } catch (err) {
    console.error('Admin delete comment error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
}; 