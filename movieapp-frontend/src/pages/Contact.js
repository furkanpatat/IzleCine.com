import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaUser, FaFileAlt, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setError(data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
        >
          <FaArrowLeft className="mr-2 text-xl" />
          <span className="text-lg font-medium">Geri Dön</span>
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">
              İletişim
            </h1>
            <p className="text-gray-300 text-lg">
              Geri bildirimleriniz bizim için değerli
            </p>
          </div>

          {submitSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-400 text-xl mr-3" />
                <div>
                  <h3 className="text-green-400 font-semibold">Geri Bildirim Gönderildi!</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-200 font-medium mb-2 flex items-center">
                    <FaUser className="mr-2 text-purple-400" />
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 font-medium mb-2 flex items-center">
                    <FaEnvelope className="mr-2 text-purple-400" />
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-200 font-medium mb-2 flex items-center">
                  <FaFileAlt className="mr-2 text-purple-400" />
                  Konu
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  placeholder="Mesajınızın konusu"
                />
              </div>

              <div>
                <label className="block text-gray-200 font-medium mb-2 flex items-center">
                  <FaFileAlt className="mr-2 text-purple-400" />
                  Mesajınız
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  placeholder="Geri bildiriminizi, şikayetinizi veya önerinizi buraya yazabilirsiniz..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-lg" />
                    <span>Gönder</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-purple-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">E-posta</h3>
              <p className="text-gray-300 text-sm">
                Geri bildirimleriniz için
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="text-pink-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">Hızlı Yanıt</h3>
              <p className="text-gray-300 text-sm">
                24 saat içinde dönüş
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold mb-2">Güvenli</h3>
              <p className="text-gray-300 text-sm">
                Verileriniz korunur
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 