import React from 'react'
import more from '../images/more.png'
import Messages from './Messages'
import Input from './Input'
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useState } from 'react';
import { useEffect } from 'react';

function Chat() {

  const { data } = useContext(ChatContext);
  const [user, setUser] = useState(null);


  return (
    <div className='chat'>
        <div className='Info'>
          {/* {console.log(data)} */}
          <span>{data.user.displayName}</span>
          <div className='chatInfo'>
            <img src={more}/>
          </div> 
        </div>
        <Messages/>
        <Input/>    
      </div>
  )
}

export default Chat
