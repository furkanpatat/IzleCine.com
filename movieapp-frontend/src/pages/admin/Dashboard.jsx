import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, Users, Plus, Trash2, BarChart2, User, FileText, Settings, MessageSquare, Shield, RefreshCw } from 'lucide-react';
import categoryService from '../../services/categoryService';

// JWT decode helper
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isClearingCache, setIsClearingCache] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const payload = parseJwt(token);
    if (!payload || payload.role !== 'admin') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleClearCache = async () => {
    try {
      setIsClearingCache(true);
      await categoryService.clearCategoryCache();
      alert('Kategori cache\'i başarıyla temizlendi!');
    } catch (error) {
      console.error('Cache temizleme hatası:', error);
      alert('Cache temizleme sırasında hata oluştu!');
    } finally {
      setIsClearingCache(false);
    }
  };

  const cards = [
    {
      title: 'Edit Movies',
      icon: Film,
      path: '/admin/edit-movies',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      title: 'User Statistics',
      icon: Users,
      path: '/admin/user-stats',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      title: 'Add Movie',
      icon: Plus,
      path: '/admin/add-movie',
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700'
    },
    {
      title: 'Delete Movie',
      icon: Trash2,
      path: '/admin/delete-movies',
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    },
    {
      title: 'General Statistics',
      icon: BarChart2,
      path: '/admin/statistics',
      color: 'bg-yellow-600',
      hoverColor: 'hover:bg-yellow-700'
    },
    {
      title: 'Manage Users',
      icon: User,
      path: '/admin/manage-users',
      color: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700'
    },
    {
      title: 'Geri Bildirimler',
      icon: MessageSquare,
      path: '/admin/feedback',
      color: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700'
    },
    {
      title: 'Admin Management',
      icon: Shield,
      path: '/admin/admin-management',
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <button
          onClick={handleClearCache}
          disabled={isClearingCache}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            isClearingCache 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 hover:scale-105'
          } text-white shadow-lg`}
        >
          <RefreshCw className={`w-5 h-5 ${isClearingCache ? 'animate-spin' : ''}`} />
          {isClearingCache ? 'Temizleniyor...' : 'Cache Temizle'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const isDisabled = card.path === '#';

          return (
            <Link
              key={card.title}
              to={card.path}
              className={`${card.color} ${card.hoverColor} p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => isDisabled && e.preventDefault()}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-8 h-8 text-white" />
                <h2 className="text-xl font-semibold text-white">{card.title}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard; 