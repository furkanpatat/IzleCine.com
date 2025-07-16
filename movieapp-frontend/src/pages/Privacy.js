import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaShieldAlt, FaUserSecret, FaLock, FaEye } from 'react-icons/fa';

const Privacy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
        >
          <FaArrowLeft className="mr-2 text-xl" />
          <span className="text-lg font-medium">{t('Geri Dön')}</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">
              {t('Gizlilik Politikası')}
            </h1>
            <p className="text-gray-300 text-lg">
              {t('Bu bir öğrenci projesidir - basit ve şeffaf bilgiler')}
            </p>
          </div>

          <div className="space-y-8">
            {/* Genel Bilgiler */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaUserSecret className="mr-3 text-purple-400" />
                {t('Hakkımızda')}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('İzleCine, bir öğrenci projesi olarak geliştirilmiştir. Bu platform eğitim amaçlı oluşturulmuştur ve gerçek bir ticari hizmet değildir.')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('Bu proje, web geliştirme becerilerini geliştirmek ve modern teknolojileri öğrenmek amacıyla yapılmıştır.')}
              </p>
            </div>

            {/* Toplanan Veriler */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaEye className="mr-3 text-blue-400" />
                {t('Veri Kullanımı')}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('Hesap Bilgileri')}</h3>
                  <p className="text-gray-300">
                    Kayıt olurken e-posta adresiniz ve kullanıcı adınız saklanır. 
                    Bu bilgiler sadece platform kullanımı için gereklidir.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('Kullanım Verileri')}</h3>
                  <p className="text-gray-300">
                    Beğendiğiniz filmler, yorumlarınız ve izleme listeniz gibi 
                    veriler kişiselleştirilmiş deneyim için saklanır.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('Çerezler')}</h3>
                  <p className="text-gray-300">
                    Platform deneyiminizi iyileştirmek için temel çerezler kullanılır. 
                    Bu çerezler oturum bilgilerinizi ve tercihlerinizi hatırlar.
                  </p>
                </div>
              </div>
            </div>

            {/* Veri Güvenliği */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaLock className="mr-3 text-green-400" />
                {t('Güvenlik')}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Bu bir öğrenci projesi olduğu için, verileriniz eğitim amaçlı 
                geliştirilmiş güvenlik önlemleri ile korunmaktadır:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{t('Şifreleme')}</h4>
                  <p className="text-gray-300 text-sm">
                    Hassas veriler şifrelenerek saklanır
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{t('Güvenli Bağlantı')}</h4>
                  <p className="text-gray-300 text-sm">
                    HTTPS protokolü kullanılır
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{t('Veri Saklama')}</h4>
                  <p className="text-gray-300 text-sm">
                    Veriler güvenli sunucularda saklanır
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{t('Erişim Kontrolü')}</h4>
                  <p className="text-gray-300 text-sm">
                    Sadece gerekli verilere erişim sağlanır
                  </p>
                </div>
              </div>
            </div>

            {/* Üçüncü Taraf Hizmetler */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4">{t('Üçüncü Taraf Hizmetler')}</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Bu proje aşağıdaki üçüncü taraf hizmetleri kullanmaktadır:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• TMDB API - Film ve dizi verileri için</li>
                <li>• React ve Node.js - Platform geliştirme için</li>
                <li>• MongoDB - Veri saklama için</li>
                <li>• Render - Hosting hizmeti için</li>
              </ul>
            </div>

            {/* İletişim */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4">{t('İletişim')}</h2>
              <p className="text-gray-300 leading-relaxed">
                Bu proje hakkında sorularınız varsa, 
                <a href="/contact" className="text-purple-400 hover:text-purple-300 underline">
                  {t('iletişim sayfamızdan')}
                </a> 
                {t('bizimle iletişime geçebilirsiniz.')}
              </p>
            </div>

            {/* Önemli Not */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">{t('Önemli Not')}</h2>
              <p className="text-gray-300 leading-relaxed">
                Bu bir öğrenci projesidir ve ticari amaçla kullanılmamaktadır. 
                Gerçek film içerikleri TMDB API'si üzerinden sağlanmaktadır. 
                Bu platform sadece eğitim ve portföy amaçlı geliştirilmiştir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 