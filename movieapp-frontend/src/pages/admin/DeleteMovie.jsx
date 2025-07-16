import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import apiService from '../../services/apiService';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const DeleteMovie = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }
    const payload = parseJwt(token);
    if (!payload || payload.role !== 'admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    const fetchMovies = async () => {
      try {
        const data = await apiService.getAdminMovies(token); // MongoDB'den admin filmleri
        setMovies(data || []);
      } catch (err) {
        console.error('Filmler alınamadı:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [navigate]);
        

  const handleDelete = async (movieId) => {
    const confirmDelete = window.confirm('Bu filmi silmek istediğinize emin misiniz?');
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await apiService.deleteAdminMovie(token, movieId);
      setMovies(prev => prev.filter(m => m._id !== movieId)); // anında güncelle
    } catch (err) {
      alert('Silme işlemi başarısız: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-white">Delete Movies</h1>
      </div>

      {/* Movies List */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-300">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="p-8 text-center text-gray-300">No movies found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {movies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {movie.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {movie.genre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {movie.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(movie._id)}
                        disabled={isLoading}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteMovie; 