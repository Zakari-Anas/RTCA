import React, { useContext, useEffect } from 'react';
import chat from '../images/cam.png';
import { useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../context/authContext';
import { auth } from '../Firebase';
import { ChatContext } from '../context/ChatContext';

function Chats() {
  const [chats, setChats] = useState([]);
const { dispatch } = useContext(ChatContext);
  
useEffect(() => {

    const getChats = () => {
      if (auth.currentUser && auth.currentUser.uid) {
        const unsub = onSnapshot(doc(db, 'usersChat', auth.currentUser.uid), (doc) => {
          setChats(doc.data());
          // console.log(doc.data());
        });

        return () => {
          unsub();
        };
      }
      
    };

    getChats();
  }, [auth.currentUser]);


    const sortedChats = Object.entries(chats)?.sort((a, b) => {
    // Assuming chatData.Date is a valid timestamp
    return b[2]?.Date - a[1]?.Date;
  });

  
 const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

return (
  <div className='Chats'>
    {sortedChats?.map(([chatId, chatData]) => (
      <div className='userChat' key={chatId} onClick={() =>handleSelect(chatData.UserInfo)}>
        
        {chatData.UserInfo && chatData.UserInfo.photoURL &&(
          <img src={chatData.UserInfo.photoURL} alt='User Avatar' />
        ) }
      
        <div className='userChatInfo'>
          <span>{chatData.UserInfo && chatData.UserInfo.displayName}</span>
          <p>{chatData.lastMessage?.text}</p>
        </div>
      </div>
    ))}
  </div>
);

}

export default Chats;
