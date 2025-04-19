import React from 'react'
import logo from '../assets/logo.png'

const Header = () => {
  return (
    

    <header  className='fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-75'>
            <div className='container mx-auto px-2 flex items-center h-full'>

                <div>
                    <img
                            src={logo}
                            alt='logo'
                            width={240}

                    />
                </div>
            </div>

    </header>
  )
}

export default Header
