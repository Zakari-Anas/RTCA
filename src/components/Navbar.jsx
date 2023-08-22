import React from 'react'
import image from '../images/img.png'
import Search from './Search'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { auth } from '../Firebase'

function NavBar() {
  return (
   <div className='Navbar'>
      {auth.currentUser ? (
        <>
          <img src={auth.currentUser.photoURL} alt="User Profile" />
          <span className='Username'>{auth.currentUser.displayName}</span>
        </>
      ) : (
        <span className='Username'>Guest</span>
      )}
    </div>
  )
}

export default NavBar
