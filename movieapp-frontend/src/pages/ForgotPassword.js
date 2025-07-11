import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PasswordReset.css';
import authService from '../services/authService';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await authService.forgotPassword({ email });
            setMessage(response.message);
            setEmail(''); // Formu temizle
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="password-reset-container">
            <h2>{t('Şifremi Unuttum')}</h2>
            <p>
                {t('E-posta adresinizi girin, şifrenizi sıfırlamak için size bir bağlantı göndereceğiz.')}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">{t('E-posta Adresi')}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('ornek@email.com')}
                        required
                        disabled={isLoading}
                    />
                </div>

                {message && (
                    <div className={message.includes('hata') || message.includes('bulunamadı') ? 'error-message' : 'success-message'}>
                        {message}
                    </div>
                )}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? t('Gönderiliyor...') : t('Şifre Yenile')}
                </button>
            </form>

            <div className="back-to-login">
                <Link to="/login">{t('Giriş sayfasına geri dön')}</Link>
            </div>
        </div>
    );
};

export default ForgotPassword; 