import React, { useEffect , useState} from 'react'
import logo from '../assets/logo.png'
import { href, Link, NavLink, useNavigate } from 'react-router-dom'
import userIcon from '../assets/user.png'
import { IoSearch, IoSearchOutline } from "react-icons/io5";
import { navigation } from '../contants/navigation';
import { RiStarSmileFill } from "react-icons/ri";

const Header = () => {

  const [searchInput, setSearchInput] = useState ('')
  const navigate = useNavigate()
  
  
  useEffect (()=>{
    if(searchInput){
      navigate(`/search?q=${searchInput}`)
    }
   
  },[searchInput])

  const handleSubmit = (e)=>{
    e.preventDefault()
  }

  return (

    <header  className='fixed top-0 w-full h-16 bg-gradient-to-r from-indigo-900 via-purple-800 to-black bg-opacity-90 shadow-lg shadow-purple-900/40 backdrop-blur-md z-50'>
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
  {[...Array(20)].map((_, i) => (
    <div
      key={i}
      className="meteor"
      style={{
        top: `${Math.random() * 1}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${4 + Math.random() * 2}s`,
      }}
    />
  ))}
</div>
<div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
  {[...Array(100)].map((_, i) => (
    <div
      key={i}
      className={`star star-${(i % 4) + 1}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`, // Yıldızlar farklı zamanlarda hareket etmeye başlayacak
        opacity: Math.random() * 0.5 + 0.3, // Yıldızların parlaklıkları rastgele olacak
      }}
    />
  ))}
</div>

            <div className='container mx-auto px-3 flex items-center h-full'>

                <Link to = {"/"} >
                    <img
                            src={logo}
                            alt='logo'
                            width={240}

                    />
                </Link>
              <nav className='hidden lg:flex items-center gap-1 ml-5'>
                {
                  navigation.map((nav,index)=>{
                    return(
                      <div>
                        <NavLink key={nav.label} to={nav.href} className={({isActive})=> `px-2 hover:text-neutral-100 ${isActive && "text-neutral-100"}`}> 
                          {nav.label}
                        </NavLink>
                      </div>
                    )
                  })
                }
              </nav>
              <div className='ml-auto flex items-center gap-5'>
                <form className='flex items-center gap-2' onSubmit={handleSubmit}>
                  <input
                  type='text'
                  placeholder='Search...'
                  className='bg-transparent px-4 py-1 outline-none border-none hidden lg:block'
                  onChange={(e)=>setSearchInput(e.target.value)}
                  value = {searchInput}
                  />
                  <button className='text-2xl text-white'>
                    <IoSearchOutline/>
                  </button>
                </form>
               
                <div className='w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all'>
                    <img
                        src={userIcon}
                        width='w-10 h-10'
                     />
                </div>
                {/* 💖 Favoriler İkonu */}
                <Link to="/favorites" className="text-white text-xl hover:text-purple-700 transition-all ">
                <RiStarSmileFill /> 
                        </Link>
                  {/* Giriş Yap Butonu */}
                <Link to="/login" className="bg-purple-700 hover:bg-purple-300 text-white px-4 py-2 rounded-md transition-all duration-300">
                  Giriş Yap
                </Link>      
              </div>
            </div>

    </header>
  )
}

export default Header
