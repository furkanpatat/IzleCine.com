import React from 'react'
import { useTranslation } from 'react-i18next';
import { FaHeart, FaGithub, FaTwitter, FaInstagram, FaYoutube, FaFilm, FaStar } from 'react-icons/fa';
import i18n from '../i18n';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaFilm className="text-white text-lg" />
              </div>
              <div>
                <a href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors duration-200">
                  {t('İzleCine')}
                </a>
                <p className="text-gray-200 text-xs">{t('Film izleme platformu')}</p>
              </div>
            </div>
            <p className="text-gray-200 mb-4 max-w-md text-sm">
              {t("En yeni filmler için İzleCine'ye hoş geldiniz. Kaliteli eğlence deneyimi için buradayız.")}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                <FaGithub className="text-lg" />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center text-sm">
              <FaStar className="mr-2 text-purple-400" />
              {t('Hızlı Linkler')}
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="/" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 text-sm">
                  {t('Ana Sayfa')}
                </a>
              </li>
              <li>
                <a href="/movies" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 text-sm">
                  {t('Filmler')}
                </a>
              </li>
              <li>
                <a href="/watchlist" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 text-sm">
                  {t('İzleme Listesi')}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center text-sm">
              <FaHeart className="mr-2 text-pink-400" />
              {t('Destek')}
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="/contact" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 text-sm">
                  {t('İletişim')}
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 text-sm">
                  {t('Gizlilik Politikası')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-200 hover:text-purple-400 transition-colors duration-200 text-sm">
                  {t('Kullanım Şartları')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
            <div className="text-gray-200 text-xs mb-3 md:mb-0 text-center md:text-left">
              © 2024 {t('İzleCine')}. {t('Tüm hakları saklıdır.')}
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-200 text-xs">
              <span>{t('Made with')}</span>
              <FaHeart className="text-pink-500 animate-pulse" />
              <span>{t('for movie lovers')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
