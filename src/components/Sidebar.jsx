import React from 'react'
import NavBar from './Navbar'
import Chats from './Chats'
import Search from './Search'
function Sidebar() {
  return (
    <div>
      <NavBar/>
       <Search/>
      <Chats/>
    </div>
  )
}

export default Sidebar
