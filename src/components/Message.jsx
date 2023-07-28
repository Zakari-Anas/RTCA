import React from 'react'
import random from '../images/ranya.png'
function Message() {
  return (
    <div className='message'>
        <div className='messageInfo'>
          <img src={random}></img>
          <span> Date </span>
        </div>
        <div className='messageContent'>
          <p>the message sent</p> 
          <img src={random}></img>
         </div>
    </div>
  )
}

export default Message
