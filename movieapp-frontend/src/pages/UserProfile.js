import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUser, FaHeart, FaComment, FaTrash, FaEdit, FaSave, FaTimes, FaArrowLeft, FaStar, FaCalendar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import userService from '../services/userService';
import tmdbService from '../services/tmdbService';
import axios from 'axios'; // Added axios import

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    favoriteGenres: []
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [photoEditMode, setPhotoEditMode] = useState(false);
  const [photoInput, setPhotoInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  // userData değişince formu doldur
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        favoriteGenres: user.favoriteGenres || []
      });
    }
  }, [user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userService.updateProfile(profileData);
      setUser(updated);
      setEditingProfile(false);
    } catch (err) {
      alert('Profil güncellenemedi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Fotoğraf güncelleme işlemi
  const handlePhotoEdit = () => {
    setPhotoInput(user?.photo || '');
    setPhotoEditMode(true);
  };
  const handlePhotoSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await userService.updateProfile({ photo: photoInput });
      setUser(updated);
      setPhotoEditMode(false);
    } catch (err) {
      alert('Fotoğraf güncellenemedi: ' + err.message);
    }
  };

  // API base URL for production
  // const API_BASE = process.env.REACT_APP_API_URL || '/api';

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

        setUser(profileData);
        setLikedMovies(likedMoviesWithDetails);
        setUserComments(userCommentsWithTitles);
        console.log('Loaded user comments:', userCommentsWithTitles);
      } catch (apiError) {
        console.log('API calls failed, using mock data:', apiError);
        // Fallback to mock data for testing
        setUser({
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
    setCommentToDelete({ ...comment, index });
    setShowDeleteModal(true);
  };

  const handleEditComment = (e, comment) => {
    e.stopPropagation();
    setEditingCommentId(comment.id || comment._id);
    setEditingCommentContent(comment.content);
  };

  const handleSaveComment = async (e, comment) => {
    e.stopPropagation();
    
    if (!editingCommentContent.trim()) {
      alert('Yorum içeriği boş olamaz!');
      return;
    }

    try {
      const commentId = comment.id || comment._id;
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: editingCommentContent })
      });

      if (response.ok) {
        const updatedComment = await response.json();
        
        // Yorumları güncelle
        setUserComments(prev => 
          prev.map(c => 
            (c.id || c._id) === commentId 
              ? { ...c, content: editingCommentContent }
              : c
          )
        );
        
        setEditingCommentId(null);
        setEditingCommentContent('');
        alert('Yorum başarıyla güncellendi!');
      } else {
        const error = await response.json();
        alert('Yorum güncellenirken hata oluştu: ' + error.message);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Yorum güncellenirken hata oluştu!');
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingCommentId(null);
    setEditingCommentContent('');
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
      await axios.delete(`${API_BASE}/comments/${commentId}`, {
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
      alert(t('Yorum silinirken bir hata oluştu!'));
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
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 relative">
        {/* Sağ üstte genel düzenle butonu */}
        {!editingProfile && (
          <button
            className="absolute top-4 right-4 bg-pink-700 hover:bg-pink-800 text-white p-2 rounded-full shadow transition-all duration-200 flex items-center justify-center"
            onClick={() => setEditingProfile(true)}
            title={t('Profili Düzenle')}
          >
            <FaEdit className="text-lg" />
          </button>
        )}
        <div className="flex items-center space-x-4 mb-6 relative">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden relative">
            {editingProfile ? (
              profileData.photo ? (
                <img src={profileData.photo} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-3xl text-white" />
              )
            ) : (
              user?.photo ? (
                <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-3xl text-white" />
              )
            )}
            {/* Fotoğrafın üzerinde ayrı düzenle butonu */}
            {!editingProfile && (
              <button
                className="absolute bottom-1 right-1 bg-gray-900/80 hover:bg-blue-600 text-white p-1 rounded-full shadow transition-all duration-200 flex items-center justify-center border border-white border-opacity-20"
                onClick={handlePhotoEdit}
                title="Fotoğrafı Düzenle"
              >
                <FaEdit className="text-xs" />
              </button>
            )}
          </div>
          {/* Fotoğraf düzenleme alanı (modal gibi) */}
          {photoEditMode && !editingProfile && (
            <div className="absolute left-24 top-0 bg-gray-900 border border-gray-700 rounded-lg p-4 z-20 shadow-xl flex flex-col items-start">
              <form onSubmit={handlePhotoSave} className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={photoInput}
                  onChange={e => setPhotoInput(e.target.value)}
                  placeholder="Yeni fotoğraf URL"
                  className="px-2 py-1 rounded bg-gray-700 text-white w-48"
                />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Kaydet</button>
                  <button type="button" className="bg-gray-600 text-white px-3 py-1 rounded" onClick={() => setPhotoEditMode(false)}>İptal</button>
                </div>
              </form>
            </div>
          )}
          <div>
            {editingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-3">
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleEditChange}
                  placeholder={t('Kullanıcı Adı')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-light font-sans placeholder-gray-400 mb-1 shadow-sm"
                  required
                  autoComplete="off"
                  style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="firstName"
                    value={user?.firstName || ''}
                    onChange={handleEditChange}
                    placeholder={t('Ad')}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-normal font-sans placeholder-gray-400 shadow-sm"
                    required
                    autoComplete="off"
                    style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={user?.lastName || ''}
                    onChange={handleEditChange}
                    placeholder={t('Soyad')}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-normal font-sans placeholder-gray-400 shadow-sm"
                    required
                    autoComplete="off"
                    style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleEditChange}
                  placeholder={t('Email')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-light font-sans placeholder-gray-400 shadow-sm"
                  required
                  autoComplete="off"
                  style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}
                />
                <div className="flex space-x-2 mt-2 items-center">
                  <button type="submit" className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-sm" disabled={saving}>{saving ? t('Kaydediliyor...') : t('Kaydet')}</button>
                  <button type="button" className="flex-1 h-10 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all shadow-sm" onClick={() => setEditingProfile(false)}>{t('İptal')}</button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-light font-sans text-white">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || 'User'
                  }
                </h2>
                <p className="text-pink-700 font-normal font-sans">@{user?.username}</p>
                <p className="text-gray-300 font-light font-sans">{user?.email}</p>
              </>
            )}
            <p className="text-sm text-gray-300 flex items-center mt-1">
              <FaCalendar className="mr-1" />
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('Recently')}
            </p>
          </div>
        </div>
        {/* Şehir ve doğum yılı kartları aynı kalacak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.city && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-gray-300 text-sm font-medium">{t('City')}</h3>
              <p className="text-white text-lg">{user.city}</p>
            </div>
          )}
          {user?.birthYear && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-gray-300 text-sm font-medium">{t('Birth Year')}</h3>
              <p className="text-white text-lg">{user.birthYear}</p>
            </div>
          )}
        </div>
      </div>
      {/* İstatistik kartları aynı kalacak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">{t('Liked Movies')}</p>
              <p className="text-2xl font-bold text-white">{likedMovies.length}</p>
            </div>
            <FaHeart className="text-2xl text-pink-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">{t('Comments')}</p>
              <p className="text-2xl font-bold text-white">{userComments.length}</p>
            </div>
            <FaComment className="text-2xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">{t('Average Rating')}</p>
              <p className="text-2xl font-bold text-white">
                {userComments.length > 0 
                  ? (userComments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / userComments.length).toFixed(1)
                  : t('N/A')
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
        <h3 className="text-xl font-semibold text-white">{t('Liked Movies')}</h3>
        <span className="text-gray-400 text-sm">{likedMovies.length} {t('movies')}</span>
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
                <p className="text-gray-300 text-xs">
                  {t('Liked on')} {movie.likedAt ? new Date(movie.likedAt).toLocaleDateString() : t('Recently')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaHeart className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">{t('No liked movies yet')}</p>
          <p className="text-gray-300 text-sm">{t('Start liking movies to see them here')}</p>
        </div>
      )}
    </div>
  );

  const renderCommentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{t('Your Comments')}</h3>
        <span className="text-gray-400 text-sm">{userComments.length} {t('comments')}</span>
      </div>

      {userComments.length > 0 ? (
        <div className="space-y-4">
          {userComments.map((comment, index) => {
            const commentId = comment.id || comment._id;
            const isDeleting = deletingCommentId === commentId;
            const isEditing = editingCommentId === commentId;
            
            return (
              <div 
                key={index} 
                className={`bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700/50 transition-all duration-300 transform ${
                  isDeleting 
                    ? 'opacity-0 scale-95 -translate-y-2 pointer-events-none' 
                    : 'opacity-100 scale-100 translate-y-0'
                } ${isEditing ? 'border-purple-500/50' : 'cursor-pointer'}`}
                onClick={() => !isEditing && navigate(`/movie/${comment.movieId}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{comment.movieTitle || t('Movie')}</h4>
                    <p className="text-gray-300 text-sm">
                      {comment.commentedAt ? new Date(comment.commentedAt).toLocaleDateString() : t('Recently')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {comment.rating && (
                      <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-yellow-500 text-sm font-medium">{comment.rating}</span>
                      </div>
                    )}
                    {isEditing ? (
                      <>
                        <button
                          onClick={(e) => handleSaveComment(e, comment)}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                          title={t('Save comment')}
                        >
                          <FaSave className="text-sm" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-all duration-200"
                          title={t('Cancel edit')}
                        >
                          <FaTimes className="text-sm" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleEditComment(e, comment)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                          title={t('Edit comment')}
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComment(comment, index);
                          }}
                          className={`p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title={t('Delete comment')}
                          disabled={isDeleting}
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <textarea
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 resize-none"
                    rows="3"
                    placeholder="Yorumunuzu düzenleyin..."
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="text-gray-300">{comment.content}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaComment className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">{t('No comments yet')}</p>
          <p className="text-gray-300 text-sm">{t('Start commenting on movies to see them here')}</p>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'profile', label: t('Profile'), icon: FaUser },
    { id: 'liked', label: t('Liked Movies'), icon: FaHeart },
    { id: 'comments', label: t('Comments'), icon: FaComment }
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-8 px-4 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-400">{t('Loading profile data...')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-8 px-4 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <IoClose className="text-6xl text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">{t('Error Loading Profile')}</h2>
              <p className="text-gray-400 mb-4">{error}</p>
                  <button
                onClick={fetchUserData}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {t('Try Again')}
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-8 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft />
            <span>{t('Back')}</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {t('Logout')}
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
                <h2 className="text-2xl font-bold text-white mb-2">{t('Yorumu Sil')}</h2>
                <p className="text-gray-400 mb-6">
                  {t('Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')}
                </p>
                
                {commentToDelete && (
                  <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                    <p className="text-gray-300 text-sm mb-2">{t('Yorum:')}</p>
                    <p className="text-white italic">"{commentToDelete.content}"</p>
                    <p className="text-gray-400 text-xs mt-2">
                      {t('Film:')} {commentToDelete.movieTitle}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={cancelDeleteComment}
                    className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
                  >
                    {t('İptal')}
                  </button>
                  <button
                    onClick={confirmDeleteComment}
                    disabled={deleting}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{t('Siliniyor...')}</span>
                      </>
                    ) : (
                      <>
                        <FaTrash className="w-4 h-4" />
                        <span>{t('Evet, Sil')}</span>
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