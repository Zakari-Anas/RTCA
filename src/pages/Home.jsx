import React from 'react'
import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'
import '../sass/Home.scss'

function Home() {
  return (
    <div className='Home'>
      <div className='Chat'><Chat/></div>
        <div className='Sidebar'><Sidebar/></div>
        
    
    </div>
  )
}

export default Home
