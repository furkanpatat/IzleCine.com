const Rating = require('../models/Rating');

exports.rateMovie = async (req, res) => {
  try {
    const { userId, movieId, rating } = req.body;
    if (!userId || !movieId || typeof rating !== 'number') {
      return res.status(400).json({ message: 'Eksik veya hatalı bilgi.' });
    }

    const existing = await Rating.findOne({ userId, movieId });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.status(200).json({ message: 'Puan güncellendi.' });
    }

    const newRating = new Rating({ userId, movieId, rating });
    await newRating.save();

    return res.status(201).json({ message: 'Puan kaydedildi.' });

  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası.', error: err.message });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { movieId } = req.params;

    const result = await Rating.aggregate([
      { $match: { movieId } },
      {
        $group: {
          _id: '$movieId',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({ avgRating: 0, count: 0 });
    }

    res.json(result[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası.', error: err.message });
  }
};
// eski rate çeker tekrar girince yıldızlar dolu
exports.getUserRating = async (req, res) => {
  const { movieId, userId } = req.params;

  try {
    const rating = await Rating.findOne({ movieId, userId });
    if (!rating) return res.json({ rating: 0 });
    return res.json({ rating: rating.rating });
  } catch (err) {
    return res.status(500).json({ message: 'Puan getirilemedi.' });
  }
};

exports.getGlobalRatingStats = async (req, res) => {
  try {
    const result = await Rating.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);
    if (result.length === 0) {
      return res.json({ averageRating: 0, totalRatings: 0 });
    }
    res.json({ averageRating: result[0].avgRating, totalRatings: result[0].totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGlobalRatingStatsPromise = async () => {
  const result = await Rating.aggregate([
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);
  if (result.length === 0) {
    return { averageRating: 0, totalRatings: 0 };
  }
  return { averageRating: result[0].avgRating, totalRatings: result[0].totalRatings };
};

