import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

const AdminManagement = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
        axios.get(`${API_BASE}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const adminsOnly = (res.data || []).filter(u => u.role === 'admin');
                setAdmins(adminsOnly);
            })
            .catch(() => {
                setAdmins([]);
                setError('Admin kullanıcılar alınamadı.');
            })
            .finally(() => setIsLoading(false));
    }, [navigate]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => navigate('/admin')}
                    className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold text-white">Admin Management</h1>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">admin@admin.com</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">admin@admin.com</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400 font-bold">admin</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">05/07/2025</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-4 text-gray-400 text-sm">Şifre: <span className="font-bold text-white">superadmin123</span></div>
            </div>
        </div>
    );
};

export default AdminManagement; 