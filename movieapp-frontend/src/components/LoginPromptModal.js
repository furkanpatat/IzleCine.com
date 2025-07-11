import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTimes, FaSignInAlt, FaEye } from 'react-icons/fa';

const LoginPromptModal = ({ isOpen, onClose, actionType = 'bu işlemi' }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleContinueAsGuest = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-8 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Giriş Gerekli
          </h2>
          <p className="text-gray-400">
            {actionType} gerçekleştirmek için giriş yapmanız gerekiyor.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Giriş yaparak şunları yapabilirsiniz:</h3>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• Filmleri beğenebilirsiniz</li>
              <li>• Yorum yapabilirsiniz</li>
              <li>• İzleme listenize film ekleyebilirsiniz</li>
              <li>• Filmleri puanlayabilirsiniz</li>
              <li>• Kişiselleştirilmiş öneriler alabilirsiniz</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <FaSignInAlt className="w-4 h-4" />
            <span>Giriş Yap</span>
          </button>
          
          <button
            onClick={handleContinueAsGuest}
            className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50 flex items-center justify-center space-x-2"
          >
            <FaEye className="w-4 h-4" />
            <span>Ziyaretçi Olarak Devam Et</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Ziyaretçi olarak filmleri görüntüleyebilir ve kategorileri keşfedebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal; 