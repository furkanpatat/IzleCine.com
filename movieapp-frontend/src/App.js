import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';

function App() {
  return (
    <main>
      <Header/>

      <div className='pt-16'>
      <Outlet/>
      </div>

      <Footer/>
      <MobileNavigation/>
    </main>
  );
}

export default App;
