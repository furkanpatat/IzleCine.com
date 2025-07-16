import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaFileContract, FaExclamationTriangle, FaCheckCircle, FaBan, FaUserShield } from 'react-icons/fa';

const Terms = () => {
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
              <FaFileContract className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">
              {t('Kullanım Şartları')}
            </h1>
            <p className="text-gray-300 text-lg">
              {t('Bu bir öğrenci projesidir - basit kullanım kuralları')}
            </p>
          </div>

          <div className="space-y-8">
            {/* Genel Kabul */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="mr-3 text-green-400" />
                Proje Hakkında
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                İzleCine, {t('bir öğrenci projesi olarak geliştirilmiştir.')} 
                {t('Bu platform eğitim amaçlı oluşturulmuştur ve gerçek bir ticari hizmet değildir.')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                  {t('Bu proje, web geliştirme becerilerini geliştirmek ve modern teknolojileri öğrenmek amacıyla yapılmıştır.')}
              </p>
            </div>

            {/* Hesap Sorumlulukları */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaUserShield className="mr-3 text-blue-400" />
                Hesap Kullanımı
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('Hesap Güvenliği')}</h3>
                  <p className="text-gray-300">
                    {t('Hesabınızın güvenliğinden siz sorumlusunuz. Güçlü bir şifre kullanın ve hesap bilgilerinizi kimseyle paylaşmayın.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('Doğru Bilgiler')}</h3>
                  <p className="text-gray-300">
                    {t('Kayıt olurken doğru bilgiler vermekle yükümlüsünüz. Bu bir eğitim projesi olduğu için gerçek bilgilerinizi kullanmanız önerilir.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('Kişisel Kullanım')}</h3>
                  <p className="text-gray-300">
                    {t('Bu platform sadece kişisel kullanım içindir. Ticari amaçla kullanılmamalıdır.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Kullanım Kuralları */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaExclamationTriangle className="mr-3 text-yellow-400" />
                {t('Kullanım Kuralları')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">{t('Yapmanız Gerekenler')}</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {t('Platformu eğitim amaçlı kullanın')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {t('Diğer kullanıcılara saygılı olun')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {t('Yapıcı yorumlar yazın')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {t('Platform performansını düşünün')}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">{t('Yapmamanız Gerekenler')}</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">✗</span>
                      {t('Spam veya reklam içeriği paylaşmayın')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">✗</span>
                      {t('Nefret söylemi yapmayın')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">✗</span>
                      {t('Platformu kötüye kullanmayın')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">✗</span>
                      {t('Otomatik bot kullanmayın')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* İçerik Politikası */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4">{t('İçerik Politikası')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('Yorumlar')}</h3>
                  <p className="text-gray-300">
                    {t('Yorumlarınız yapıcı ve saygılı olmalıdır. Saldırgan, nefret dolu veya uygunsuz yorumlar silinebilir.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('Puanlama')}</h3>
                  <p className="text-gray-300">
                    {t('Film puanlarınız dürüst ve objektif olmalıdır. Bu bir eğitim projesi olduğu için gerçek değerlendirmeler yapın.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{t('İçerik Kaynağı')}</h3>
                  <p className="text-gray-300">
                    {t('Film ve dizi verileri TMDB API\'si üzerinden sağlanmaktadır. Bu içerikler telif hakları ile korunmaktadır.')}
                  </p>
                </div>
              </div>
            </div>

            {/* Teknik Sınırlamalar */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4">{t('Teknik Sınırlamalar')}</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {t('Platform sadece kişisel kullanım içindir')}
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {t('Ticari kullanım yasaktır')}
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {t('Otomatik bot kullanımı yasaktır')}
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {t('Platform performansını etkileyen aktiviteler yasaktır')}
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {t('Hizmet kesintileri olabilir (öğrenci projesi)')}
                </li>
              </ul>
            </div>

            {/* Fikri Mülkiyet */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4">{t('Fikri Mülkiyet')}</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('İzleCine platformu, bir öğrenci projesi olarak geliştirilmiştir. Bu proje eğitim amaçlı oluşturulmuştur.')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('Platform üzerindeki film ve dizi içerikleri, TMDB API\'si üzerinden sağlanmaktadır ve ilgili yapım şirketlerinin telif hakları altındadır.')}
              </p>
            </div>

            {/* Sorumluluk Reddi */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4">{t('Sorumluluk Reddi')}</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('Bu bir öğrenci projesidir ve ticari amaçla kullanılmamaktadır. Gerçek film içerikleri TMDB API\'si üzerinden sağlanmaktadır. Bu platform sadece eğitim ve portföy amaçlı geliştirilmiştir.')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('Platform kesintileri, veri kaybı veya güvenlik ihlalleri durumunda sorumlu tutulamayız. Bu bir eğitim projesidir.')}
              </p>
            </div>

            {/* Hesap Kapatma */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaBan className="mr-3 text-red-400" />
                {t('Hesap Kapatma')}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('Bu kullanım şartlarını ihlal etmeniz durumunda hesabınız geçici olarak askıya alınabilir veya kapatılabilir.')}
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-medium text-red-400 mb-2">{t('Kapatma Sebepleri')}:</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• {t('Şartların ciddi ihlali')}</li>
                  <li>• {t('Tekrarlanan uyarılar')}</li>
                  <li>• {t('Platform güvenliğine tehdit')}</li>
                  <li>• {t('Kötüye kullanım')}</li>
                </ul>
              </div>
            </div>

            {/* İletişim */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-semibold mb-4">{t('İletişim')}</h2>
              <p className="text-gray-300 leading-relaxed">
                {t('Bu proje hakkında sorularınız varsa, iletişim sayfamızdan bizimle iletişime geçebilirsiniz.')}
              </p>
            </div>

            {/* Önemli Not */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">{t('Önemli Not')}</h2>
              <p className="text-gray-300 leading-relaxed">
                {t('Bu bir öğrenci projesidir ve ticari amaçla kullanılmamaktadır. Gerçek film içerikleri TMDB API\'si üzerinden sağlanmaktadır. Bu platform sadece eğitim ve portföy amaçlı geliştirilmiştir.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 