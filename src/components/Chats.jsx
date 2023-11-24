import React, { useContext, useEffect } from 'react';
import chat from '../images/cam.png';
import { useState } from 'react';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../context/authContext';
import { auth } from '../Firebase';
import { ChatContext } from '../context/ChatContext';
import connected from '../images/png-transparent-green-dot-corporation-business-cercle-de-fermieres-d-ahuntsic-thumbnail.png'
import disconneted from '../images/téléchargé.png'
function Chats() {
  const [chats, setChats] = useState([]);
  const { dispatch } = useContext(ChatContext);
  const [userOnline,setuserOnline]=useState([]);
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

  const unsubscribe = ()=>{
    onSnapshot(collection(db, 'USERS'), (snapshot) => {
      const updatedUserOnline = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        updatedUserOnline.push({ id: doc.id, ...userData });
      });
      setuserOnline(updatedUserOnline);
    });
  }

    // Cleanup the listener when the component unmounts

      getChats();
      unsubscribe();
    

  }, [auth.currentUser]);


    

  
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

return (
  <div className='Chats'>
    {Object.entries(chats)
      ?.map(([chatId, chatData]) => chatData) // Extract chatData from the object
      .sort((a, b) => {
        const displayNameA = b.UserInfo && b.UserInfo.displayName ? b.UserInfo.displayName.toLowerCase() : '';
        const displayNameB = a.UserInfo && a.UserInfo.displayName ? a.UserInfo.displayName.toLowerCase() : '';
        return displayNameA.localeCompare(displayNameB); 
      })
      .map((chatData, index) => (
        <div className='userChat' key={index} onClick={() => handleSelect(chatData.UserInfo)}>
          {chatData.UserInfo && chatData.UserInfo.photoURL && (
            <img src={chatData.UserInfo.photoURL} alt='User Avatar' />
          )}
          <div className='userChatInfo'>
            <span style={NameStyle} >{chatData.UserInfo && chatData.UserInfo.displayName}</span>
            {/* <span>{chatData.Date}</span> */}
            {chatData.UserInfo && userOnline.map((user,index) => {
              if (user.Id === chatData.UserInfo.uid && user.online === true) {
                // return <p key={index}>Connected</p>;
                return <img src={connected} style={dotStyle}  />


              }
              if (user.Id === chatData.UserInfo.uid && user.online === false) {
                 return <img src={disconneted} style={dotStyle}  />
              }
              return null;
            })}
            
          </div>
        </div>
      ))}
  </div>
);

}
const dotStyle = {
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  backgroundColor: 'green',
  marginTop: '5px',
  marginLeft: '-40px', // Adjust this value to move the dot down
};

const NameStyle = {
  width: '200px',
  height: '20px',
  // borderRadius: '50%',
  // backgroundColor: 'green',
  marginTop: '15px',
  // marginLeft: '-40px', // Adjust this value to move the dot down
};
export default Chats;
