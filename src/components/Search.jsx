import React from 'react'
import '../sass/Home.scss'

function Search() {
  return (
    <div className='search'>
        <div className='Searchform'>
            <input type='text' placeholder='Find user'/>
        </div>
        <div className='userChat'>
                <img src='https://www.w3schools.com/howto/img_avatar.png'/>
            <div className='userChatInfo'> 
                <span>ranya</span>

            </div>

        </div>
     
    </div>
  )
}

export default Search
