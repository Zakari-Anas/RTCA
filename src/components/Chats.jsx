import React from 'react'
import chat from '../images/cam.png'
function Chats() {
  return (
    <div className='Chats'>
       <div className='userChat'>
                <img src={chat}/>
            <div className='userChatInfo'> 
                <span>ranya </span>
                <p>Hello </p>
            </div>

        </div>
    </div>
  )
}

export default Chats
