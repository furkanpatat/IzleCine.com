import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTrash, FaEnvelope, FaEnvelopeOpen, FaCheckCircle, FaClock } from 'react-icons/fa';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      } else {
        setError('Geri bildirimler yüklenemedi.');
      }
    } catch (err) {
      setError('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/admin/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFeedbacks(feedbacks.map(feedback => 
          feedback._id === id ? { ...feedback, status: 'read' } : feedback
        ));
        fetchStats();
      }
    } catch (err) {
      setError('İşlem başarısız.');
    }
  };

  const handleMarkAsResolved = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/admin/${id}/resolved`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFeedbacks(feedbacks.map(feedback => 
          feedback._id === id ? { ...feedback, status: 'resolved' } : feedback
        ));
        fetchStats();
      }
    } catch (err) {
      setError('İşlem başarısız.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu geri bildirimi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
        fetchStats();
      }
    } catch (err) {
      setError('Silme işlemi başarısız.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-400" />;
      case 'read':
        return <FaEnvelopeOpen className="text-blue-400" />;
      case 'resolved':
        return <FaCheckCircle className="text-green-400" />;
      default:
        return <FaEnvelope className="text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'read':
        return 'Okundu';
      case 'resolved':
        return 'Çözüldü';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'read':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'resolved':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filter === 'all') return true;
    return feedback.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Geri Bildirimler</h1>
        <p className="text-gray-300">Kullanıcı geri bildirimlerini yönetin</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Toplam</p>
              <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
            </div>
            <FaEnvelope className="text-purple-400 text-xl" />
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bekleyen</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending || 0}</p>
            </div>
            <FaClock className="text-yellow-400 text-xl" />
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Okundu</p>
              <p className="text-2xl font-bold text-blue-400">{stats.read || 0}</p>
            </div>
            <FaEnvelopeOpen className="text-blue-400 text-xl" />
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Çözüldü</p>
              <p className="text-2xl font-bold text-green-400">{stats.resolved || 0}</p>
            </div>
            <FaCheckCircle className="text-green-400 text-xl" />
          </div>
        </div>
      </div>

      {/* Filtre */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
        >
          <option value="all">Tümü</option>
          <option value="pending">Bekleyen</option>
          <option value="read">Okundu</option>
          <option value="resolved">Çözüldü</option>
        </select>
      </div>

      {/* Geri Bildirimler Listesi */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12">
            <FaEnvelope className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-400">Geri bildirim bulunamadı.</p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{feedback.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
                      {getStatusText(feedback.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{feedback.name}</span>
                    <span>{feedback.email}</span>
                    <span>{new Date(feedback.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {feedback.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleMarkAsRead(feedback._id)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                        title="Okundu olarak işaretle"
                      >
                        <FaEye className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleMarkAsResolved(feedback._id)}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                        title="Çözüldü olarak işaretle"
                      >
                        <FaCheck className="text-green-400" />
                      </button>
                    </>
                  )}
                  {feedback.status === 'read' && (
                    <button
                      onClick={() => handleMarkAsResolved(feedback._id)}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                      title="Çözüldü olarak işaretle"
                    >
                      <FaCheck className="text-green-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(feedback._id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <FaTrash className="text-red-400" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-200 whitespace-pre-wrap">{feedback.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement; 