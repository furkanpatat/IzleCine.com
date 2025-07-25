import React, { useState, useEffect } from 'react';
import { Flag, Trash2, EyeOff, Check, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const ReportedComments = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState('all');

  // API base URL for production
  const API_BASE = process.env.REACT_APP_API_URL || '/api';

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

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/comments/admin/reportedComments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Raporlanan yorumlar alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/comments/admin/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReports();
    } catch (error) {
      console.error('Yorum silinirken hata:', error);
    }
  };

  const getReasonColor = (reason) => {
    switch (reason) {
      case 'spam':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'hate_speech':
        return 'bg-red-500/20 text-red-400';
      case 'harassment':
        return 'bg-purple-500/20 text-purple-400';
      case 'inappropriate_content':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getReasonText = (reason) => {
    switch (reason) {
      case 'spam':
        return 'Spam';
      case 'hate_speech':
        return 'Nefret Söylemi';
      case 'harassment':
        return 'Taciz';
      case 'inappropriate_content':
        return 'Uygunsuz İçerik';
      default:
        return 'Diğer';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Raporlanan Yorumlar</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tüm Raporlar</option>
            <option value="spam">Spam</option>
            <option value="hate_speech">Nefret Söylemi</option>
            <option value="harassment">Taciz</option>
            <option value="inappropriate_content">Uygunsuz İçerik</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-6">
        {reports.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Raporlanan Yorum Bulunmuyor</h3>
            <p className="text-gray-400">Şu anda incelenmesi gereken rapor bulunmuyor.</p>
          </div>
        ) : (
          reports.map((comment) => (
            <div key={comment._id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={comment.userId?.profileImage || '/default-avatar.png'}
                    alt={comment.userId?.username || 'Kullanıcı'}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{comment.userId?.username || 'Kullanıcı'}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                <p className="text-gray-200 leading-relaxed">{comment.content}</p>
              </div>
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors duration-200 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportedComments; 