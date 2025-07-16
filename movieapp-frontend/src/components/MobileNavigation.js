import React from 'react'
import { mobileNavigation } from '../contants/navigation'
import { NavLink, useLocation } from 'react-router-dom'

const MobileNavigation = () => {
  const location = useLocation();
  const isHiddenOnThisPage = ['/login', '/signup', '/reset-password'].includes(location.pathname);

  if (isHiddenOnThisPage) return null; // belirli sayfalarda alt bar'ı gizle

  return (
    <section className='h-16 fixed bottom-0 w-full z-50 shadow-2xl border-t border-gray-800 bg-white/10 backdrop-blur-xl rounded-t-2xl overflow-hidden' 
      style={{boxShadow: '0 -8px 32px 0 rgba(80,0,120,0.10)'}}> 
      <div className='flex items-center justify-around h-full text-neutral-300'> 
        {
          mobileNavigation.map((nav) => (
            <NavLink
              key={nav.label + "-mobilenavigation"}
              to={nav.href}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center px-2 py-1 h-full relative group transition-all duration-200',
                  isActive ? 'text-purple-400 font-bold' : 'text-neutral-400'
                ].join(' ')
              }
            >
              <div className='text-3xl flex items-center justify-center mb-0.5 transition-all duration-200 group-hover:scale-110 group-hover:text-purple-300'>
                {nav.icon}
              </div>
              <span className='text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-200 group-hover:scale-105 group-hover:text-purple-300'>
                {nav.label}
              </span>
            </NavLink>
          ))
        }
      </div>
    </section>
  )
}

export default MobileNavigation;
