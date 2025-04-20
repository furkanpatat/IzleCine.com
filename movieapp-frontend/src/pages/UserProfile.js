import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  
  // Mock user data
  const [userData, setUserData] = useState({
    firstName: 'Halil',
    lastName: 'Yılmaz',
    username: 'ibohllylmz',
    email: 'ibrahimhalil.ylmz@msn.com',
    profilePicture: 'https://media.themoviedb.org/t/p/w235_and_h235_face/9J4KWKollSGTAADhUVEgAm4lenx.jpg',
    password: '********',
    confirmPassword: '********'
  });

  const [formData, setFormData] = useState({ ...userData });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı zorunludur';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    if (formData.password.length < 6 && formData.password !== '********') {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      setUserData(formData);
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
    setErrors({});
  };

  const renderField = (label, name, type = 'text', placeholder = '') => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {isEditing ? (
        <>
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
              errors[name] ? 'border-red-500' : ''
            }`}
            placeholder={placeholder}
          />
          {errors[name] && (
            <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
          )}
        </>
      ) : (
        <div className="px-3 py-2 bg-gray-700/50 text-white rounded-md">
          {name === 'password' || name === 'confirmPassword' ? '********' : formData[name]}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-black bg-opacity-90 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl p-8 border border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Profil Ayarları</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Geri Dön
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/50 shadow-lg"
                />
                {isEditing && (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Profil resmi URL'si"
                    />
                    {errors.profilePicture && (
                      <p className="text-red-400 text-xs mt-1">{errors.profilePicture}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderField('Ad', 'firstName', 'text', 'Adınız')}
                  {renderField('Soyad', 'lastName', 'text', 'Soyadınız')}
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField('Kullanıcı Adı', 'username', 'text', 'Kullanıcı adınız')}
              {renderField('E-posta', 'email', 'email', 'E-posta adresiniz')}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField('Şifre', 'password', 'password', 'Yeni şifre')}
              {renderField('Şifre Tekrar', 'confirmPassword', 'password', 'Şifrenizi tekrar girin')}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-500 transition-colors duration-200"
                  >
                    Kaydet
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-500 transition-colors duration-200"
                >
                  Düzenle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 