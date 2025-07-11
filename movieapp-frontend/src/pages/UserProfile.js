import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUser, FaHeart, FaComment, FaArrowLeft, FaStar, FaCalendar, FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import userService from '../services/userService';
import tmdbService from '../services/tmdbService';
import axios from 'axios'; // Added axios import

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Added state for modal
  const [commentToDelete, setCommentToDelete] = useState(null); // Added state for comment to delete
  const [deleting, setDeleting] = useState(false); // Added state for deletion process
  const [deletingCommentId, setDeletingCommentId] = useState(null); // Added state for animating comment deletion
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    console.log('UserProfile component mounted');
    console.log('localStorage user:', localStorage.getItem('user'));
    console.log('localStorage token:', localStorage.getItem('token'));
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'exists' : 'missing');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Making API calls...');
      
      try {
        const [profileData, likedMoviesData, commentsData] = await Promise.all([
          userService.getUserProfile(),
          userService.getLikedMovies(),
          userService.getUserComments()
        ]);

        console.log('API responses:', {
          profileData,
          likedMoviesData,
          commentsData
        });

        // --- Liked Movies Detaylarını TMDB'den Çek ---
        const likedMoviesWithDetails = await Promise.all(
          (likedMoviesData || []).map(async (item) => {
            // movieId string veya obje olabilir
            const movieId = item.movieId || item.id || item;
            try {
              const details = await tmdbService.getMovieDetails(movieId);
              return {
                movieId,
                title: details.title,
                posterPath: details.poster_path,
                likedAt: item.likedAt || item.liked_at || null
              };
            } catch {
              return {
                movieId,
                title: 'Unknown',
                posterPath: null,
                likedAt: item.likedAt || item.liked_at || null
              };
            }
          })
        );
        // --- Comments için movieTitle yoksa TMDB'den çek ---
        const userCommentsWithTitles = await Promise.all(
          (commentsData || []).map(async (comment) => {
            if (comment.movieTitle && comment.movieTitle !== 'Movie') {
              return comment;
            }
            try {
              const details = await tmdbService.getMovieDetails(comment.movieId);
              return { ...comment, movieTitle: details.title };
            } catch {
              return { ...comment, movieTitle: 'Unknown' };
            }
          })
        );

        setUserData(profileData);
        setLikedMovies(likedMoviesWithDetails);
        setUserComments(userCommentsWithTitles);
        console.log('Loaded user comments:', userCommentsWithTitles);
      } catch (apiError) {
        console.log('API calls failed, using mock data:', apiError);
        // Fallback to mock data for testing
        setUserData({
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          city: 'Istanbul',
          birthYear: 1990,
          createdAt: new Date().toISOString()
        });
        setLikedMovies([
          {
            movieId: '123',
            title: 'Sample Movie 1',
            posterPath: '/sample1.jpg',
            likedAt: new Date().toISOString()
          },
          {
            movieId: '456',
            title: 'Sample Movie 2',
            posterPath: '/sample2.jpg',
            likedAt: new Date().toISOString()
          }
        ]);
        setUserComments([
          {
            id: '1',
            content: 'This is a great movie!',
            movieTitle: 'Sample Movie 1',
            commentedAt: new Date().toISOString(),
            rating: 8
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userChanged'));
    navigate('/login');
  };

  const handleDeleteComment = (comment, index) => {
    console.log('Deleting comment:', comment, 'at index:', index);
    setCommentToDelete({ ...comment, index });
    setShowDeleteModal(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    console.log('Confirming deletion of comment:', commentToDelete);

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      
      const commentId = commentToDelete.id || commentToDelete._id;
      console.log('Deleting comment with ID:', commentId);
      
      // Animasyon için comment ID'sini set et
      setDeletingCommentId(commentId);
      
      // Backend'e silme isteği gönder
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Backend deletion successful, updating local state...');
      console.log('Current comments before deletion:', userComments);

      // Animasyon için kısa bir bekleme süresi
      setTimeout(() => {
        // Local state'den sadece seçilen yorumu kaldır (index kullanarak)
        setUserComments(prevComments => {
          const filteredComments = prevComments.filter((comment, index) => {
            console.log('Checking comment at index:', index, 'comment:', comment);
            return index !== commentToDelete.index;
          });
          console.log('Filtered comments:', filteredComments);
          return filteredComments;
        });

        setShowDeleteModal(false);
        setCommentToDelete(null);
        setDeletingCommentId(null); // Animasyon state'ini temizle
      }, 300); // 300ms animasyon süresi

    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Yorum silinirken bir hata oluştu!');
      setDeletingCommentId(null); // Hata durumunda animasyon state'ini temizle
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteComment = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <FaUser className="text-3xl text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {userData?.firstName && userData?.lastName 
                ? `${userData.firstName} ${userData.lastName}`
                : userData?.username || 'User'
              }
            </h2>
            <p className="text-gray-400">{userData?.email}</p>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <FaCalendar className="mr-1" />
              Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userData?.city && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm font-medium">City</h3>
              <p className="text-white text-lg">{userData.city}</p>
            </div>
          )}
          {userData?.birthYear && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm font-medium">Birth Year</h3>
              <p className="text-white text-lg">{userData.birthYear}</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Liked Movies</p>
              <p className="text-2xl font-bold text-white">{likedMovies.length}</p>
            </div>
            <FaHeart className="text-2xl text-pink-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Comments</p>
              <p className="text-2xl font-bold text-white">{userComments.length}</p>
            </div>
            <FaComment className="text-2xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-white">
                {userComments.length > 0 
                  ? (userComments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / userComments.length).toFixed(1)
                  : 'N/A'
                }
              </p>
            </div>
            <FaStar className="text-2xl text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLikedMoviesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Liked Movies</h3>
        <span className="text-gray-400 text-sm">{likedMovies.length} movies</span>
      </div>
      
      {likedMovies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {likedMovies.map((movie, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/movie/${movie.movieId}`)}
            >
              <div className="aspect-[2/3] bg-gray-700 relative">
                {movie.posterPath && (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs">
                  <FaHeart />
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-semibold mb-2 line-clamp-2">{movie.title}</h4>
                <p className="text-gray-400 text-xs">
                  Liked on {movie.likedAt ? new Date(movie.likedAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaHeart className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No liked movies yet</p>
          <p className="text-gray-500 text-sm">Start liking movies to see them here</p>
        </div>
      )}
    </div>
  );

  const renderCommentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Your Comments</h3>
        <span className="text-gray-400 text-sm">{userComments.length} comments</span>
      </div>

      {userComments.length > 0 ? (
        <div className="space-y-4">
          {userComments.map((comment, index) => {
            const commentId = comment.id || comment._id;
            const isDeleting = deletingCommentId === commentId;
            
            return (
              <div 
                key={index} 
                className={`bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700/50 transition-all duration-300 transform ${
                  isDeleting 
                    ? 'opacity-0 scale-95 -translate-y-2 pointer-events-none' 
                    : 'opacity-100 scale-100 translate-y-0'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{comment.movieTitle || 'Movie'}</h4>
                    <p className="text-gray-400 text-sm">
                      {comment.commentedAt ? new Date(comment.commentedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {comment.rating && (
                      <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-yellow-500 text-sm font-medium">{comment.rating}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComment(comment, index);
                      }}
                      className={`p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 ${
                        isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete comment"
                      disabled={isDeleting}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaComment className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No comments yet</p>
          <p className="text-gray-500 text-sm">Start commenting on movies to see them here</p>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'liked', label: 'Liked Movies', icon: FaHeart },
    { id: 'comments', label: 'Comments', icon: FaComment }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-400">Loading profile data...</p>
            </div>
          </div>
        </div>
            </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <IoClose className="text-6xl text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Error Loading Profile</h2>
              <p className="text-gray-400 mb-4">{error}</p>
                  <button
                onClick={fetchUserData}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Try Again
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-purple-400'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                <Icon className="text-sm" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'liked' && renderLikedMoviesTab()}
          {activeTab === 'comments' && renderCommentsTab()}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelDeleteComment} />
            <div className="relative bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-8 w-full max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Yorumu Sil</h2>
                <p className="text-gray-400 mb-6">
                  Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
                
                {commentToDelete && (
                  <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                    <p className="text-gray-300 text-sm mb-2">Yorum:</p>
                    <p className="text-white italic">"{commentToDelete.content}"</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Film: {commentToDelete.movieTitle}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={cancelDeleteComment}
                    className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={confirmDeleteComment}
                    disabled={deleting}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Siliniyor...</span>
                      </>
                    ) : (
                      <>
                        <FaTrash className="w-4 h-4" />
                        <span>Evet, Sil</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 