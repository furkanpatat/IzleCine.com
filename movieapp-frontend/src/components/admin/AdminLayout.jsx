import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Film,
  Users,
  Plus,
  BarChart2,
  User,
  Bell,
  Shield,
  Trash2,
  Settings,
  FileText,
  LogOut,
  Flag,
  MessageSquare
} from 'lucide-react';
import authService from '../../services/authService';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard', isActive: true },
    { path: '/admin/edit-movies', icon: Film, label: 'Edit Movies', isActive: true },
    { path: '/admin/user-stats', icon: Users, label: 'User Statistics', isActive: true },
    { path: '/admin/add-movie', icon: Plus, label: 'Add Movie', isActive: true },
    { path: '/admin/delete-movies', icon: Trash2, label: 'Delete Movie', isActive: true },
    { path: '/admin/statistics', icon: BarChart2, label: 'General Stats', isActive: true },
    { path: '/admin/manage-users', icon: User, label: 'Manage Users', isActive: true },
    { path: '/admin/system-logs', icon: FileText, label: 'System Logs', isActive: true },
    { path: '/admin/platform-settings', icon: Settings, label: 'Platform Settings', isActive: true },
    { path: '/admin/reported-comments', icon: Flag, label: 'Raporlanan Yorumlar', isActive: true },
    { path: '/admin/feedback', icon: MessageSquare, label: 'Geri Bildirimler', isActive: true },
    { path: '#', icon: Bell, label: 'Notifications', isActive: false },
    { path: '/admin/admin-management', icon: Shield, label: 'Admin Management', isActive: true },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-gray-800 fixed top-0 left-0 h-screen border-r border-gray-700 z-40">
        <nav className="mt-0">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            // Benzersiz key: path + idx
            return (
              <Link
                key={item.path === '#' ? `${item.path}-${idx}` : item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ${isActive ? 'bg-gray-700 text-white border-l-4 border-blue-500' : ''
                  } ${!item.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => !item.isActive && e.preventDefault()}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 rounded-md" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-900 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout; 