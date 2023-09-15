import React from 'react'
import { useState } from 'react'
import '../sass/SignUp&SignIn.scss'
import user from '../images/img.png'
import 'react-intl-tel-input/dist/main.css';
import IntlTelInput from 'react-intl-tel-input';
import {auth} from '../Firebase'
import { createUserWithEmailAndPassword,updateProfile} from 'firebase/auth';
import {storage} from '../Firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {doc, setDoc} from 'firebase/firestore'
import {db} from '../Firebase'
import {firebase} from '../Firebase'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

    const navigate = useNavigate();
    const [status, SetStatus] = useState(false)
        const [phone, setPhone] = useState([])
        const [firstname, setFirstName] = useState()
        const [lastname, setLastName] = useState()
        const [email, setEmail] = useState()
        const [password, setPassword] = useState()
        const [confirmPassword, setConfirmPassword] = useState() 
        const [file, setFile] = useState()
        const [error, setError] = useState(false)
      
const handleSubmit = async (e) => {   
    e.preventDefault();
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (res) {
            // Set the user's online status to true upon successful sign-up
          
            const storageRef = ref(storage, `users/${lastname}/${res.user.uid}/profile.jpg`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Handle upload progress here (if needed)
                    // You can access snapshot.bytesTransferred and snapshot.totalBytes
                },
                (error) => {
                    setError(true);
                    console.log(error);
                },
                async () => {
                    try {
                          SetStatus(true)
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        await updateProfile(res.user, {
                            displayName: firstname + " " + lastname,
                            photoURL: downloadURL
                        });

                        await setDoc(doc(db, "USERS", res.user.uid), {
                            Id: res.user.uid,
                            FirstName: firstname,
                            LastName: lastname,
                            Email: email,
                            PhoneNumber: phone.map((e)=>(e.fullNumber)),
                            PhotoURL: downloadURL,
                            displayName:res.user.displayName,
                            // online:status,
                        });

                        await setDoc(doc(db,"usersChat",res.user.uid),{
                              
                        })
                    } catch (err) {
                        setError(true);
                        console.log(err);
                    }
                }
            );
        }
    } catch (err) {
        setError(true);
        console.log(err);
    }  
}

  return (
    <div>
        <div className='formContainer'>
            <div className='formWrapper'>
                <h1 className='logo'>Just Chatting</h1>
                <a className='title'>Sign Up</a>
                    <form onSubmit={handleSubmit} className='SignUpF' >
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
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <label className='for' htmlFor  ='FileSelector' > 
                            <img src={user} className='Image'/> 
                            <span className='selectImage'>Select image</span>
                        </label>
                        <button type='submit'>Sign Up</button>
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
