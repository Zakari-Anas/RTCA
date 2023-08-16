import React from 'react'
import image from '../images/img.png'
import Search from './Search'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

function NavBar() {
    const {currentUser} = useContext(AuthContext);
  return (
   <div className='Navbar'>
      {currentUser ? (
        <>
          <img src={currentUser.photoURL} alt="User Profile" />
          <span className='Username'>{currentUser.displayName}</span>
        </>
      ) : (
        <span className='Username'>Guest</span>
      )}
    </div>
  )
}

export default NavBar
