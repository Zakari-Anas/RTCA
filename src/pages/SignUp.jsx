import React from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useState } from 'react'
import './sass/SignUp.scss'
import user from '../images/selectimage.jpg'
const SignUp = () => {
        const [phone, setPhone] = useState()
        const [name, setName] = useState()
        const [email, setEmail] = useState()
        const [password, setPassword] = useState()
        const [confirmPassword, setConfirmPassword] = useState()  

  return (
    <div>
        <div className='formContainer'>
            <div className='formWrapper'>
                <h1 className='logo'>Just Chatting</h1>
                <a className='title'>Sign Up</a>
                    <form >
                        <div className='lastFirst'> 
                            <input 
                                type='text' 
                                placeholder='FirstName'
                            />  
                            <input 
                                type='text' 
                                placeholder='LastName'
                            />
                        </div>
                       
                        <input 
                            type='email '
                            placeholder='Email'
                        />
                        <input 
                            type='password'
                            placeholder='Password'
                        />
                        <input 
                            type='password '
                            placeholder='Confirm Password'
                        />
                        <PhoneInput
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={setPhone}
                        />
                        <input 
                            type='file'
                            id='FileSelector'
                            style={{display:'none'}}
                        />
                        <label htmlFor='FileSelector' > 
                            <img src={user}/> 
                            <span>Select image</span>
                        </label>
                        <button>Sign Up</button>
                        <p>Already have an account?</p>
                    </form>
            </div>
        </div>
    </div>
  )
}

export default SignUp
