import React, { useState, useEffect } from 'react';
import BannerHome from '../components/BannerHome';
import MovieRow from '../components/MovieRow';
import tmdbService from '../services/tmdbService';
import { useTranslation } from 'react-i18next';

// Genre name to TMDb genre id map
const GENRE_NAME_TO_ID = {
  'Aksiyon': 28,
  'Komedi': 35,
  'Drama': 18,
  'Korku': 27,
  'Bilim Kurgu': 878,
  'Romantik': 10749,
  'Gerilim': 53,
  'Belgesel': 99,
  'Animasyon': 16,
  'Fantastik': 14
};

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [customMovies, setCustomMovies] = useState([]);
  const [manualMovies, setManualMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customLoading, setCustomLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customError, setCustomError] = useState(null);
  const { t } = useTranslation();

  // 📌 TMDb verilerini çek
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [
          popularMovies,
          topRatedMovies,
          upcomingMovies,
          actionMoviesData,
          comedyMoviesData,
          dramaMoviesData,
          horrorMoviesData
        ] = await Promise.all([
          tmdbService.getPopularMovies(1),
          tmdbService.getPopularMovies(2),
          tmdbService.getPopularMovies(3),
          tmdbService.getMoviesByGenre(28, 1),
          tmdbService.getMoviesByGenre(35, 1),
          tmdbService.getMoviesByGenre(18, 1),
          tmdbService.getMoviesByGenre(27, 1)
        ]);

        setTrendingMovies(popularMovies.results || []);
        setNewMovies(upcomingMovies.results || []);
        setRecommendedMovies(topRatedMovies.results || []);
        setActionMovies(actionMoviesData.results || []);
        setComedyMovies(comedyMoviesData.results || []);
        setDramaMovies(dramaMoviesData.results || []);
        setHorrorMovies(horrorMoviesData.results || []);
        setError(null);
      } catch (err) {
        setError(t('Filmler yüklenirken bir hata oluştu.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [t]);

  // 📌 Elle eklenen filmleri çek
  useEffect(() => {
    const fetchManualMovies = async () => {
      try {
        const res = await fetch('/api/movies/custom');
        const text = await res.text();
        console.log('API response text:', text);
        const data = JSON.parse(text);
        const transformed = data.map(movie => ({
          id: movie._id,
          title: movie.title,
          poster_path: movie.posterUrl,
          vote_average: movie.rating,
          release_date: `${movie.year || '2020'}-01-01`,
          genre_ids: [],
        }));
        setManualMovies(transformed);
        console.log('manualMovies:', transformed);
      } catch (err) {
        console.error('Elle eklenen filmler alınamadı:', err);
      }
    };

    fetchManualMovies();
  }, []);

  // 📌 Kullanıcı favori türlerine göre önerilenleri çek
  useEffect(() => {
    const fetchCustomMovies = () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const favoriteGenres = user?.favoriteGenres || [];

      if (!user || !favoriteGenres.length) {
        setCustomMovies([]);
        return;
      }

      const genreIds = favoriteGenres
        .map(name => GENRE_NAME_TO_ID[name])
        .filter(Boolean);

      if (!genreIds.length) {
        setCustomMovies([]);
        return;
      }

      setCustomLoading(true);
      setCustomError(null);

      tmdbService.getMoviesByGenre(genreIds.join(','), 1)
        .then(res => setCustomMovies(res.results || []))
        .catch(() => setCustomError(t('Filmler yüklenirken bir hata oluştu.')))
        .finally(() => setCustomLoading(false));
    };

    fetchCustomMovies();
    window.addEventListener('userChanged', fetchCustomMovies);
    return () => window.removeEventListener('userChanged', fetchCustomMovies);
  }, [t]);

  // 📌 Yükleniyor
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-20">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // 📌 Hata
  if (error) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-20 text-red-500">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  // 📌 Ana render
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      {trendingMovies.length > 0 && <BannerHome movies={trendingMovies} />}

      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 space-y-8 sm:space-y-16">
        {customMovies.length > 0 && !customLoading && !customError && (
          <div className="category-section animate-fade-in">
            <MovieRow title={t('Seçimlerinize Göre')} movies={customMovies} />
          </div>
        )}

        {customLoading && (
          <div className="text-center text-gray-400 py-8">{t('Yükleniyor...')}</div>
        )}
        {customError && (
          <div className="text-center text-red-400 py-8">{customError}</div>
        )}

        {trendingMovies.length > 0 && (
          <div className="category-section animate-fade-in">
            <MovieRow title={t('Trend Filmler')} movies={trendingMovies} />
          </div>
        )}

        {newMovies.length > 0 && (
          <div className="category-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <MovieRow title={t('Yeni Gelenler')} movies={newMovies} />
          </div>
        )}

        {actionMovies.length > 0 && (
          <div className="category-section animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <MovieRow title={t('Aksiyon Filmleri')} movies={actionMovies} />
          </div>
        )}

        {comedyMovies.length > 0 && (
          <div className="category-section animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <MovieRow title={t('Komedi Filmleri')} movies={comedyMovies} />
          </div>
        )}

        {dramaMovies.length > 0 && (
          <div className="category-section animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <MovieRow title={t('Drama Filmleri')} movies={dramaMovies} />
          </div>
        )}

        {horrorMovies.length > 0 && (
          <div className="category-section animate-fade-in" style={{ animationDelay: '1s' }}>
            <MovieRow title={t('Korku Filmleri')} movies={horrorMovies} />
          </div>
        )}

        {recommendedMovies.length > 0 && (
          <div className="category-section animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <MovieRow title={t('İlginizi Çekebilir')} movies={recommendedMovies} />
          </div>
        )}

        {/* Özel Eklenen Filmler */}
        <>
          {console.log('manualMovies render:', manualMovies)}
          <div className="category-section animate-fade-in" style={{ animationDelay: '1.4s' }}>
            <MovieRow title={t('Sadece İzleCine.com\'da')} movies={manualMovies} />
          </div>
        </>
      </div>
    </div>
  );
};

export default Home;
