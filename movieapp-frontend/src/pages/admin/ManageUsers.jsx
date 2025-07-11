import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import axios from 'axios';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
    // Gerçek kullanıcıları çek
    axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(() => {
        setUsers([]);
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const handleDelete = (userId) => {
    setDeleteUserId(userId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/users/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(u => (u._id || u.id) !== deleteUserId));
      setModalMessage('Kullanıcı başarıyla silindi.');
    } catch (err) {
      setModalMessage('Kullanıcı silinirken hata oluştu.');
    } finally {
      setIsLoading(false);
      setShowModal(false);
      setDeleteUserId(null);
      setTimeout(() => setModalMessage(''), 2000);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteUserId(null);
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
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>
      </div>

      {/* Users List */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-300">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-300">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(user._id || user.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full animate-fadeIn">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 rounded-full p-3 mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Kullanıcıyı Sil</h2>
              <p className="mb-6 text-gray-600 text-center">Bu kullanıcıyı silmek istediğinize emin misiniz? <br />Bu işlem geri alınamaz.</p>
              <div className="flex w-full gap-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow hover:from-red-700 hover:to-pink-700 transition-all duration-200"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalMessage && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg z-50 ${modalMessage.includes('başarıyla') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {modalMessage}
        </div>
      )}
    </div>
  );
};

export default ManageUsers; 