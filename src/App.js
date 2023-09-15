import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import { signOut } from 'firebase/auth';
import { auth, db } from './Firebase';
import NavBar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Profil from './pages/profil';
import './App.css';
import { doc, updateDoc } from 'firebase/firestore';

function App() {
  const currentUser = useContext(AuthContext);

  const signOutUser = async (e) => {
    //  e.preventDefault();
      await updateDoc(doc(db, 'USERS', auth.currentUser.uid), {
        online: false,
      }).then(() => {
        signOut(auth)
      }).catch((error) => {
        console.log(error);
      });
   
    
  
  }

  return (
    <div className="App">
      <Router>
        <nav className='navigation'>
          <ul className='ul nav-links'>
            {auth.currentUser && (    
              <>
                <li className='li'><Link to='/home'>Home</Link></li>
                <li className='li'><Link to='/Post'>Posts</Link></li>
                <li className='li'><Link to='/Profil'>Profile</Link></li>
                <li className='li'><Link onClick={() => signOutUser() } to='logout'>Logout</Link></li>
              </>
            ) }
          </ul>
        </nav>

        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/home' element={currentUser ? <Home /> : <Login />} />
          <Route path='/logout' element={<Login />} />
          <Route path='/Post' element={currentUser ? <Posts /> : <Login />} />
          <Route path='/profil' element={<Profil/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
