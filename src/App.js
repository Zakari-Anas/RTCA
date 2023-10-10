import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import { signOut } from 'firebase/auth';
import { auth, db } from './Firebase';
import {Login} from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Profil from './pages/profil';
import './App.css';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
let sessionStartTime = null;

function App() {
  const currentUser = useContext(AuthContext);

        const [seconds, setSeconds] = useState(0);
        const [minutes, setMinutes] = useState(0);
        const [hours, setHours] = useState(0);
      //  const [sessionStartTime , setSessionStartTime] = useState(null);

          useEffect(() => {
            if (auth.currentUser ) {
              const interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
              }, 1000);

              return () => clearInterval(interval);
            } else {
          
            }
          }, [auth.currentUser]);

          useEffect(() => {
            
            if (auth.currentUser && seconds === 60) {
              setSeconds(0);
              setMinutes((prevMinutes) => prevMinutes + 1);
            }
            if (auth.currentUser && minutes === 60) {
              setMinutes(0);
              setHours((prevHours) => prevHours + 1);
            }

          }, [auth.currentUser, seconds, minutes, hours]);

        sessionStartTime= `${hours}:${minutes}:${seconds}`;
        console.log(sessionStartTime);


 const signOutUser = async (e) => {
  // Calculate the total session time in seconds
  const totalSessionTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;

  // Get the current user document
  const userDocRef = doc(db, 'USERS', auth.currentUser.uid);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    // Get the existing "Time spent" value from the user document
    const existingTimeSpent = userDocSnapshot.data()['Time spent'] || '0:0:0';

    // Split the existing time into hours, minutes, and seconds
    const [existingHours, existingMinutes, existingSeconds] = existingTimeSpent.split(':');

    // Calculate the new total time spent
    const newTotalSeconds =
      parseInt(existingHours) * 3600 +
      parseInt(existingMinutes) * 60 +
      parseInt(existingSeconds) +
      totalSessionTimeInSeconds;

    // Calculate hours, minutes, and seconds for the new total time spent
    const newHours = Math.floor(newTotalSeconds / 3600);
    const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
    const newSeconds = newTotalSeconds % 60;

    // Format the new time spent as a string
    const newTimeSpent = `${newHours}:${newMinutes}:${newSeconds}`;

    // Update the user document with the new time spent and set online to false
    await updateDoc(userDocRef, {
      online: false,
      'Time spent': newTimeSpent,
    });
      setSeconds(0);
      setMinutes(0);
      setHours(0);

    // Sign out the user
    await signOut(auth);
  }
};


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
          <Route path='/home' element={auth.currentUser ? <Home /> : <Login />} />
          <Route path='/logout' element={<Login />} />
          <Route path='/Post' element={auth.currentUser ? <Posts /> : <Login />} />
          <Route path='/profil' element={<Profil/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
