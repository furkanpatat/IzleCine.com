import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Memoize star and meteor data to prevent re-rendering
    const starElements = useMemo(() => {
        return [...Array(100)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.3,
            className: `star star-${(i % 4) + 1}`
        }));
    }, []);

    const meteorElements = useMemo(() => {
        return [...Array(20)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 1}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 2}s`
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(t('Şifreler eşleşmiyor'));
            return;
        }
        try {
            await authService.register({ username, email, password });
            alert(t('Registration successful!'));
            navigate('/complete-profile');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-black bg-opacity-90 relative">
            {/* Animated Background - Full Height */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                {meteorElements.map((meteor) => (
                    <div
                        key={meteor.id}
                        className="meteor"
                        style={{
                            top: meteor.top,
                            left: meteor.left,
                            animationDelay: meteor.animationDelay,
                            animationDuration: meteor.animationDuration,
                        }}
                    />
                ))}
            </div>
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                {starElements.map((star) => (
                    <div
                        key={star.id}
                        className={star.className}
                        style={{
                            top: star.top,
                            left: star.left,
                            animationDelay: star.animationDelay,
                            opacity: star.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Signup Form */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700/50 transition-all duration-500 ease-out opacity-100">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">{t('Kayıt Ol')}</h2>
                            <p className="text-gray-300">{t('Yeni bir hesap oluşturarak film dünyasına katılın.')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                    {t('Kullanıcı Adı')}
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    placeholder={t('kullanici_adi')}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    {t('E-posta Adresiniz')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    placeholder={t('ornek@email.com')}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    {t('Şifre')}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    placeholder={t('••••••••')}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                                    {t('Şifre Tekrar')}
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    placeholder={t('••••••••')}
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg"
                            >
                                {t('Kayıt Ol')}
                            </button>
                            
                            <div className="text-center">
                                <Link 
                                    to="/login" 
                                    className="inline-block w-full bg-gray-700/50 text-gray-300 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-600/50 hover:text-white hover:scale-105"
                                >
                                    {t('Giriş Yap')}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage; 