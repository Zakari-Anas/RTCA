import React, { useEffect } from 'react'
import { useState } from 'react'
import '../sass/SignUp&SignIn.scss'
import user from '../images/img.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../Firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth' 
import { AuthContext } from '../context/authContext'
import { useContext } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { set } from 'mongoose'






const Login = () => {
        const navigate = useNavigate();
        const [email, setEmail] = useState()
        const [password, setPassword] = useState()
 




  const handleSubmit = async (e) => {
    try {
     
      e.preventDefault(); 
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigate('/Post');
   
      updateDoc(doc(db, 'USERS', auth.currentUser.uid), {
        online: true,
      });

    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };


  
  return (
    <div>
        <div className='formContainer'>
            <div className='formWrapper'>
                <h1 className='logo'>Just Chatting</h1>
                    <form  onSubmit={handleSubmit} className='SignUpF' >
                     
                        <input onChange={(e) => setEmail(e.target.value)}
                            type='email '
                            placeholder='Email'
                        />
                        <input  onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            placeholder='Password'
                        />
                        
                     
                      
                        <button type='submit'>Sign In</button>
                        <a className='links' href="/register"> You don't have an account? Register</a>
                      
                    </form>
            </div>
        </div> 

       

         
        
    
                                
    </div>

   
  )
}

export { Login };
