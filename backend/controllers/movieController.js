const Movie = require('../models/Movie');
const mongoose = require('mongoose');

exports.addMovie = async (req, res) => {
  try {
    const {
      title, genre, year, director, description,
      posterUrl, duration, rating, cast, language, country
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Film adı ve açıklama zorunludur.' });
    }

    const movie = new Movie({
      title,
      genre,
      year,
      director,
      description,
      posterUrl,
      duration,
      rating,
      cast,
      language,
      country,
      addedBy: req.admin?.userId || null
    });

    await movie.save();
    res.status(201).json({ message: 'Film başarıyla eklendi.', movie });
  } catch (err) {
    console.error('Add movie error:', err);
    res.status(500).json({ message: 'Film eklenirken sunucu hatası.' });
  }
};

exports.getMovieStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    res.json({ totalMovies });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMovieStatsPromise = async () => {
  const totalMovies = await Movie.countDocuments();
  return { totalMovies };
};

exports.getAllMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Geçersiz film ID formatı.' });
  }
  const movie = await Movie.findById(id);
  if (!movie) {
    return res.status(404).json({ message: 'Film bulunamadı.' });
  }
  await movie.deleteOne();
  res.json({ message: 'Film başarıyla silindi.' });
};

// 🔍 Gelişmiş film arama fonksiyonu
exports.searchMovies = async (req, res) => {
  try {
    const { query, genre, director, cast, sortBy = 'title', sortOrder = 'asc' } = req.query;

    const searchConditions = [];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { title: regex },
          { director: regex },
          { genre: regex },
          { cast: { $in: [regex] } }
        ]
      });
    }

    if (genre) searchConditions.push({ genre: new RegExp(genre, 'i') });
    if (director) searchConditions.push({ director: new RegExp(director, 'i') });
    if (cast) searchConditions.push({ cast: { $in: [new RegExp(cast, 'i')] } });

    const filter = searchConditions.length > 0 ? { $and: searchConditions } : {};
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const movies = await Movie.find(filter).sort(sortOptions);

    res.json(movies);
  } catch (err) {
    console.error('Search movies error:', err);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

exports.getCustomMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}); // tüm filmleri getir (geçici çözüm)
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Özel filmler alınamadı.' });
  }
};




