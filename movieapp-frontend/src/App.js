import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import { Outlet, useLocation } from 'react-router-dom';
import tmdbService from './services/tmdbService';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBannerData } from './store/izleCine';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Admin sayfalarında footer'ı gizle
  const isAdminPage = location.pathname.startsWith('/admin');

  const fetchTrendingData = async () => {
    try {
      const response = await tmdbService.getTrendingMovies();
      dispatch(setBannerData(response.results));
    } catch (error) {
      console.log("error", error);
    }
  };

  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${savedTheme}`);
  }, []);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  return (
    <div className="app-container bg-gradient-to-b from-gray-900 to-black">
      {!isAdminPage && <Header />}
      <main className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
      {!isAdminPage && <Footer />}
      <MobileNavigation />
    </div>
  );
}

export default App;
