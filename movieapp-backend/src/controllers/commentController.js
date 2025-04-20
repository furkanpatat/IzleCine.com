const Comment = require('../models/Comment');
const Report = require('../models/Report');

// Yorum oluşturma
exports.createComment = async (req, res) => {
  try {
    const { content, movieId } = req.body;
    const userId = req.user._id;

    const comment = new Comment({
      content,
      movieId,
      userId
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Yorum oluşturulurken bir hata oluştu', error });
  }
};

// Yorum raporlama
exports.reportComment = async (req, res) => {
  try {
    const { commentId, reason, description } = req.body;
    const reporterId = req.user._id;

    const report = new Report({
      commentId,
      reporterId,
      reason,
      description
    });

    await report.save();

    // Yorumun durumunu güncelle
    await Comment.findByIdAndUpdate(commentId, {
      $push: { reports: report._id },
      status: 'reported'
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Rapor oluşturulurken bir hata oluştu', error });
  }
};

// Yorum silme (admin)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    const comment = await Comment.findByIdAndUpdate(commentId, {
      status: 'deleted',
      $set: { 'adminNotes': reason }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }

    res.json({ message: 'Yorum başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Yorum silinirken bir hata oluştu', error });
  }
};

// Yorum gizleme (admin)
exports.hideComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    const comment = await Comment.findByIdAndUpdate(commentId, {
      status: 'hidden',
      $set: { 'adminNotes': reason }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }

    res.json({ message: 'Yorum başarıyla gizlendi' });
  } catch (error) {
    res.status(500).json({ message: 'Yorum gizlenirken bir hata oluştu', error });
  }
};

// Raporları listele (admin)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: 'pending' })
      .populate('commentId')
      .populate('reporterId');

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Raporlar alınırken bir hata oluştu', error });
  }
}; 