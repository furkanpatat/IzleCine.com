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
  const movies = await Movie.find(); // filtre gerekiyorsa buraya eklenir
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
