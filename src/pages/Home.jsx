import React from 'react'
import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'
import '../sass/Home.scss'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { AuthContextProvider } from '../context/authContext'

function Home() {
    const currentUser = useContext(AuthContext);

  console.log({currentUser})
  return (
    <AuthContextProvider>
    <div className='Home'>
      
        <div className='Chat'><Chat/></div>
        <div className='Sidebar'><Sidebar/></div>
    </div>
    </AuthContextProvider>
  )
}

export default Home
