import React from 'react'
import attach from '../images/attach.png'
import img from '../images/img.png'
import send from '../images/ios-send.png'
function Input() {
  return (
    <div className='input'>
      <input type='text'placeholder="What's Up"/>
      <div className='send'>
        <img src={attach}></img>
        <input id='file' type='file' style={{display:'none'}}/>
        <label className='fichier' htmlFor='file'>
            <img src={img}></img>
        </label>
        <button className='sendB'><img src={send}></img></button>
      </div>
    </div>
  )
}

export default Input
