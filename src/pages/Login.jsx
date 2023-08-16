import React from 'react'
import { useState } from 'react'
import '../sass/SignUp&SignIn.scss'
import user from '../images/img.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { auth } from '../Firebase'
import { signInWithEmailAndPassword } from 'firebase/auth' 
import { AuthContext } from '../context/authContext'
import { useContext } from 'react'
const Login = () => {
        const navigate = useNavigate();
        const [email, setEmail] = useState()
        const [password, setPassword] = useState()
        const {currentUser} = useContext(AuthContext);
       
        
const handleSubmit = async (e) => {

      signInWithEmailAndPassword(auth, email, password);
    // if (auth.currentUser) {
      navigate('/home');
    // } else {
    //   alert('Something went wrong');
    // }
            
    

}
  return (
    <div>
        <div className='formContainer'>
            <div className='formWrapper'>
                <h1 className='logo'>Just Chatting</h1>
                    <form  onSubmit={handleSubmit}className='SignUpF' >
                     
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

export default Login
