import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import tmdbService from '../services/tmdbService';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [tmdbTotalMovies, setTmdbTotalMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const [adminStats, tmdbData] = await Promise.all([
          apiService.getAdminGeneralStats(token),
          tmdbService.getPopularMovies(1)
        ]);
        setStats(adminStats);
        setTmdbTotalMovies(tmdbData.total_results);
      } catch (err) {
        setError(err.message || 'İstatistikler alınamadı');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400 py-16">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 py-16">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Genel İstatistikler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 text-gray-300">Toplam Kullanıcı</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 text-gray-300">Toplam Film (TMDb)</h3>
          <p className="text-3xl font-bold text-green-400">{tmdbTotalMovies}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 text-gray-300">Günlük Aktif Kullanıcı</h3>
          <p className="text-3xl font-bold text-orange-400">{stats.activeUsers}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 text-gray-300">Yeni Kayıtlar (7 gün)</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.newSignups}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 text-gray-300">Toplam İnceleme</h3>
          <p className="text-3xl font-bold text-red-400">{stats.totalReviews}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
          <h3 className="text-xl font-semibold mb-2 text-gray-300">Ortalama Puan</h3>
          <p className="text-3xl font-bold text-yellow-400">{stats.averageRating ? stats.averageRating.toFixed(2) : 0}</p>
        </div>
      </div>

      {/* Grafik Bölümü */}
      <div className="mt-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Kullanıcı Aktivitesi</h2>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Grafik görselleştirmesi yakında eklenecek</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage; 