import React from 'react'
import { useState } from 'react'
import '../sass/SignUp&SignIn.scss'
import user from '../images/img.png'
import 'react-intl-tel-input/dist/main.css';
import IntlTelInput from 'react-intl-tel-input';



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
                    <form  className='SignUpF' >
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
                             name="mobile"
                             placeholder="Enter Your Number" 
                             input
                             type="tel"
                            //  value={this.state.phoneNumber}
                        />
                        <input 
                            type='file'
                            id='FileSelector'
                            style={{display:'none'}}
                        />
                        <label className='for' htmlFor  ='FileSelector' > 
                            <img src={user} className='Image'/> 
                            <span className='selectImage'>Select image</span>
                        </label>
                        <button>Sign Up</button>
                        <a className='links' href='/login'>Already have an account?</a>
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
