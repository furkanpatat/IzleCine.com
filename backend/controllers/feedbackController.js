const Feedback = require('../models/Feedback');

// Kullanıcı feedback gönderir
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Tüm alanlar gereklidir.' });
    }

    const feedback = new Feedback({
      name,
      email,
      subject,
      message
    });

    await feedback.save();
    
    res.status(201).json({ 
      message: 'Geri bildiriminiz başarıyla gönderildi. Teşekkürler!' 
    });
  } catch (err) {
    console.error('Feedback submit error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Admin tüm feedback'leri görür
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(feedbacks);
  } catch (err) {
    console.error('Get feedback error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Admin feedback'i okundu olarak işaretler
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback bulunamadı.' });
    }
    
    res.json({ message: 'Feedback okundu olarak işaretlendi.', feedback });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Admin feedback'i çözüldü olarak işaretler
exports.markAsResolved = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status: 'resolved' },
      { new: true }
    );
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback bulunamadı.' });
    }
    
    res.json({ message: 'Feedback çözüldü olarak işaretlendi.', feedback });
  } catch (err) {
    console.error('Mark as resolved error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Admin feedback'i siler
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findByIdAndDelete(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback bulunamadı.' });
    }
    
    res.json({ message: 'Feedback başarıyla silindi.' });
  } catch (err) {
    console.error('Delete feedback error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Admin feedback istatistiklerini görür
exports.getFeedbackStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const pending = await Feedback.countDocuments({ status: 'pending' });
    const read = await Feedback.countDocuments({ status: 'read' });
    const resolved = await Feedback.countDocuments({ status: 'resolved' });
    
    res.json({
      total,
      pending,
      read,
      resolved
    });
  } catch (err) {
    console.error('Get feedback stats error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
}; 