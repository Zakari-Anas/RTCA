import React from 'react'
import more from '../images/more.png'
import Messages from './Messages'
import Input from './Input'

function Chat() {
  return (
    <div className='chat'>
        <div className='Info'>
          <span>anas zakari</span>
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
