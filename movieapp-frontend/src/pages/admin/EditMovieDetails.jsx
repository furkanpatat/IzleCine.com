import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const EditMovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    cast: '',
    year: '',
    duration: '',
    category: '',
    posterUrl: '',
    trailerUrl: '',
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/movie/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Film bulunamadı');
        const data = await response.json();
        setMovie({
          title: data.title || '',
          description: data.description || '',
          cast: Array.isArray(data.cast) ? data.cast.join(', ') : (data.cast || ''),
          year: data.year || '',
          duration: data.duration || '',
          category: data.genre || '',
          posterUrl: data.posterUrl || '',
          trailerUrl: data.trailerUrl || '',
        });
        setPreviewUrl(data.posterUrl || '');
      } catch (err) {
        setMovie({
          title: '', description: '', cast: '', year: '', duration: '', category: '', posterUrl: '', trailerUrl: ''
        });
        setPreviewUrl('');
      }
    };
    fetchMovie();
  }, [id]);

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
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'posterUrl') {
      setPreviewUrl(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const body = {
        title: movie.title,
        description: movie.description,
        cast: movie.cast.split(',').map(s => s.trim()),
        year: movie.year,
        duration: movie.duration,
        genre: movie.category,
        posterUrl: movie.posterUrl,
        trailerUrl: movie.trailerUrl,
      };
      const response = await fetch(`/api/admin/movie/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Güncelleme başarısız');
      setIsLoading(false);
      navigate('/admin/edit-movies');
    } catch (err) {
      setIsLoading(false);
      alert('Film güncellenemedi!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/admin/edit-movies')}
          className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-white">Edit Movie</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={movie.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter movie title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={movie.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter movie description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cast</label>
                  <input
                    type="text"
                    name="cast"
                    value={movie.cast}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter cast members (comma separated)"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-6">Additional Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={movie.year}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Year"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration (min)</label>
                    <input
                      type="number"
                      name="duration"
                      value={movie.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Duration"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={movie.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter category"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Poster URL</label>
                  <input
                    type="url"
                    name="posterUrl"
                    value={movie.posterUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter poster URL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trailer URL</label>
                  <input
                    type="url"
                    name="trailerUrl"
                    value={movie.trailerUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter YouTube trailer URL"
                  />
                </div>
              </div>
            </div>

            {/* Poster Preview */}
            {previewUrl && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Poster Preview</h2>
                <div className="relative aspect-[2/3] w-full max-w-xs mx-auto">
                  <img
                    src={previewUrl}
                    alt="Movie poster preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-200"
                    onError={() => setPreviewUrl('')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/admin/edit-movies')}
            className="px-6 py-3 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMovieDetails; 