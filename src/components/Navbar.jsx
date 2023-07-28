import React from 'react'
import image from '../images/img.png'
import Search from './Search'

function NavBar() {
  return (
    <div className='Navbar'>
        <img src={image}></img>
        <span className='Username'>anas zakari</span>
    </div>
  )
}

export default NavBar
