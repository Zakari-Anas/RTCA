import React from 'react'
import { useState } from 'react'
import '../sass/SignUp&SignIn.scss'
import user from '../images/img.png'
import { Link } from 'react-router-dom'

const Login = () => {
        const [email, setEmail] = useState()
        const [password, setPassword] = useState()
        

  return (
    <div>
        <div className='formContainer'>
            <div className='formWrapper'>
                <h1 className='logo'>Just Chatting</h1>
                    <form  className='SignUpF' >
                     
                        <input onChange={(e) => setEmail(e.target.value)}
                            type='email '
                            placeholder='Email'
                        />
                        <input  onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            placeholder='Password'
                        />
                        
                     
                      
                        <button>Sign In</button>
                        <a className='links' href="/register"> You don't have an account? Register</a>
                      
                    </form>
            </div>
        </div> 

       

         
        
    
                                
    </div>

   
  )
}

export default Login
