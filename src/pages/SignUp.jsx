import React from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useState } from 'react'
import './sass/SignUp.scss'
import user from '../images/selectimage.jpg'
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';


const SignUp = () => {
        const [phone, setPhone] = useState([])
        const [firstname, setFirstName] = useState()
        const [lastname, setLastName] = useState()
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
                            <input  onChange={(e) => setFirstName(e.target.value)}
                                type='text' 
                                placeholder='FirstName'
                            />  
                            <input  onChange={(e) => setLastName(e.target.value)}
                                type='text' 
                                placeholder='LastName'
                            />
                        </div>
                       
                        <input onChange={(e) => setEmail(e.target.value)}
                            type='email '
                            placeholder='Email'
                        />
                        <input  onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            placeholder='Password'
                        />
                        <input onChange={(e) => setConfirmPassword(e.target.value)}
                            type='password '
                            placeholder='Confirm Password'
                        />
                       <IntlTelInput  onPhoneNumberChange={(value, countryData, number, fullNumber) => {
                                    
                                    setPhone([{value,countryData,number, fullNumber}]);
                                    }}
                            containerClassName="intl-tel-input"
                            inputClassName="form-control"
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

        <>{email}</>
         <>{firstname}</>
         <>{lastname}</>

         
        
         <>{phone.map((e)=>(
                <div key={e.value}>
                        <p>{e.fullNumber}</p>
                        
                </div>
            ))}</> 
                                
    </div>

   
  )
}

export default SignUp
