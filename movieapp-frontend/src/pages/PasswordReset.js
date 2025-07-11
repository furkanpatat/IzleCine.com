import React, { useState, useEffect } from 'react';
import './PasswordReset.css';  // Bileşene özel stil dosyasını import et
import { useTranslation } from 'react-i18next';

  // Global stilleri import et
const PasswordReset = () => {
  // State'ler: E-posta, yeni şifre ve şifre doğrulaması
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordStrengthColor, setPasswordStrengthColor] = useState('#e0e0e0');
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const { t } = useTranslation();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    switch (strength) {
      case 0:
      case 1:
        return { text: t('Zayıf'), color: '#e74c3c' };
      case 2:
      case 3:
        return { text: t('Orta'), color: '#f39c12' };
      case 4:
      case 5:
        return { text: t('Güçlü'), color: '#27ae60' };
      default:
        return { text: '', color: '#e0e0e0' };
    }
  };

  useEffect(() => {
    if (newPassword) {
      const { text, color } = checkPasswordStrength(newPassword);
      setPasswordStrength(text);
      setPasswordStrengthColor(color);
    } else {
      setPasswordStrength('');
      setPasswordStrengthColor('#e0e0e0');
    }
  }, [newPassword, t]);

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = (e) => {
    e.preventDefault();

    // Şifrelerin uyuşup uyuşmadığını kontrol et
    if (newPassword !== confirmPassword) {
      setError(t('Şifreler uyuşmuyor.'));
      return;
    }

    // Burada şifre sıfırlama işlemini yapacak API çağrısı olabilir.
    // Örneğin, API'ye e-posta ve yeni şifreyi gönderiyorsanız, bu aşamada veri gönderebilirsiniz.

    setSuccess(true);
    setError('');
  };

  return (
    <div className="password-reset-container">
      <h2>{t('Şifrenizi Sıfırlayın')}</h2>
      <p>{t('Hesabınıza tekrar erişim sağlamak için yeni bir şifre oluşturun.')}</p>

      {success ? (
        <div className="success-message">
          {t('Şifreniz başarıyla sıfırlandı!')} <a href="/login">{t('Giriş Yap')}</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="email">{t('E-posta Adresiniz:')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-input-group">
            <label htmlFor="new-password">{t('Yeni Şifre:')}</label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setShowPasswordRules(true)}
              onBlur={() => setShowPasswordRules(false)}
              required
            />
            {newPassword && (
              <div className="password-strength">
                <div className="strength-bar" style={{ backgroundColor: passwordStrengthColor }}></div>
                <span className="strength-text">{passwordStrength}</span>
              </div>
            )}
            {showPasswordRules && (
              <div className="password-rules-tooltip">
                <h3>{t('Şifre Kuralları:')}</h3>
                <ul>
                  <li className={newPassword.length >= 8 ? 'rule-met' : ''}>{t('En az 8 karakter')}</li>
                  <li className={newPassword.match(/[A-Z]/) ? 'rule-met' : ''}>{t('En az 1 büyük harf')}</li>
                  <li className={newPassword.match(/[a-z]/) ? 'rule-met' : ''}>{t('En az 1 küçük harf')}</li>
                  <li className={newPassword.match(/[0-9]/) ? 'rule-met' : ''}>{t('En az 1 sayı')}</li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">{t('Şifreyi Tekrar Girin:')}</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">{t('Şifreyi Sıfırla')}</button>
        </form>
      )}
      
      <p className="back-to-login">
        {t('Zaten şifreni hatırlıyor musun?')} <a href="/login">{t('Giriş yap')}</a>
      </p>
    </div>
  );
};

export default PasswordReset;
