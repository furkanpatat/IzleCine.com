import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import { Outlet } from 'react-router-dom';
import tmdbService from './services/tmdbService';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBannerData } from './store/izleCine';

function App() {
  const dispatch = useDispatch();

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
      <Header />
      <main className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
}

export default App;
