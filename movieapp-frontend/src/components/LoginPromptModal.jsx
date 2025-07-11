import React from 'react';
import { FaUser, FaTimes, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose, onContinueAsGuest, action }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-8 w-full max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Giriş Yapın</h2>
          <p className="text-gray-400 mb-6">
            {action || 'Bu özelliği kullanmak'} için giriş yapmanız gerekiyor.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/login"
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FaSignInAlt className="w-4 h-4" />
              <span>Giriş Yap</span>
            </Link>
            
            <Link
              to="/signup"
              onClick={onClose}
              className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50 flex items-center justify-center space-x-2"
            >
              <FaUserPlus className="w-4 h-4" />
              <span>Kayıt Ol</span>
            </Link>
            
            <button
              onClick={onContinueAsGuest}
              className="w-full bg-transparent hover:bg-gray-700/30 text-gray-400 font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
            >
              Misafir olarak devam et
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal; 