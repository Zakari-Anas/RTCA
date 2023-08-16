import React, { useContext, useEffect, useRef } from 'react'
import random from '../images/ranya.png'
import { auth } from '../Firebase'
import { ChatContext } from '../context/ChatContext'
function Message( {message}) {

  const {data}=useContext(ChatContext)

   const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className={`message ${message.senderId===auth.currentUser.uid && 'owner'}`}>
        <div className='messageInfo'>
          <img src={message.senderId===auth.currentUser.uid? auth.currentUser.photoURL: data.user.photoURL}/>
          <span> {message.Date} </span>
        </div>
        <div className='messageContent'>
          <p>{message.text}</p> 
             {message.img && <img src={message.img} alt="" />}
         </div>
    </div>
  )
}

export default Message
