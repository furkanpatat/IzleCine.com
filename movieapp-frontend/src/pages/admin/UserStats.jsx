import React, { useEffect, useState } from 'react';
import { Users, UserPlus, UserCheck } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// JWT decode helper
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const UserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    axios.get('/api/admin/user-stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStats(res.data))
      .catch(() => {
        setError('Veriler alınamadı.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats ? stats.totalUsers : '-',
      icon: Users,
      color: 'bg-blue-600',
    },
    {
      title: 'Active Users (7 days)',
      value: stats ? stats.activeUsers : '-',
      icon: UserCheck,
      color: 'bg-green-600',
    },
    {
      title: 'New Signups (7 days)',
      value: stats ? stats.newSignups : '-',
      icon: UserPlus,
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">User Statistics</h1>
      {error && <div className="text-red-400">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`${stat.color} p-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white opacity-80">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-2">{loading ? '...' : stat.value}</p>
                </div>
                <Icon className="w-12 h-12 text-white opacity-80" />
              </div>
            </div>
          );
        })}
      </div>
      {/* Placeholder for future charts */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">User Growth</h2>
        <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Chart visualization coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default UserStats; 