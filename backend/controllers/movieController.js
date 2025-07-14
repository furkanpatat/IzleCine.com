const Movie = require('../models/Movie');

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
