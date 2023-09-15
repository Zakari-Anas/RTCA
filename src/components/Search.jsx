import React from 'react';
import '../sass/Home.scss';
import { useState } from 'react';
import { collection, query, where, getDocs, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { doc, setDoc } from 'firebase/firestore';
import {auth} from '../Firebase'

function Search() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);
  // const currentUser = useContext(AuthContext);

  const handleSearch = async () => {
    try {
      const q = query(
        collection(db, 'USERS'),
        where('FirstName', '>=', username.toLowerCase() || 'LastName', '>=', username.toLowerCase()),

      );
      const querySnapshot = await getDocs(q);

      const matchingUsers = [];
      querySnapshot.forEach((doc) => {
        matchingUsers.push(doc.data());
      });

      setUsers(matchingUsers);
      console.log(users);
      setErr(false); // Reset the error state if the search is successful
    } catch (e) {
      setErr(true);
      
    }
  };

  const handleClick = (e) => {
    if (e.target.value!=='' && e.code === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = async (user)=>{
      //check if the chatRoom existe or not
    const combineId=auth.currentUser.uid > user.id ? auth.currentUser.uid + user.Id : user.Id + auth.currentUser.uid;
     

     try{
      const res=await getDoc(doc(db, 'ChatRooms',combineId));

      if(!res.exists()){
          //create the chatRoom
        await setDoc(doc(db, 'ChatRooms', combineId), {

          messages: [],
        })
        //create user chat
        await updateDoc(doc(db,"usersChat",auth.currentUser.uid),{
          [combineId+".UserInfo"]:{
            uid:user.Id,
            displayName:user.displayName,
            photoURL:user.PhotoURL  
          },
          [combineId+".Date"]:serverTimestamp()

        })

           await updateDoc(doc(db,"usersChat",user.Id),{
          [combineId+".UserInfo"]:{
            uid:auth.currentUser.uid,
            displayName:auth.currentUser.displayName,
            photoURL:auth.currentUser.photoURL  
          },
          [combineId+".Date"]:serverTimestamp()

        })
       

      }   
     }catch(e){

      console.log(e);
     }  
      setUsers([])
      setUsername('')

  }

  return (
    <div className='search'>
      <div className='Searchform'>
        <input type='text' placeholder='Find user' value={username} onKeyDown={handleClick} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
      </div>
      {users.length > 0 && (
        <>
          {users.map((user) => (
            <div className='userChat' onClick={()=> handleSelect(user)} key={user.Id}>
              <img src={user.PhotoURL || 'https://www.w3schools.com/howto/img_avatar.png'} alt='User Avatar' />
              <div className='userChatInfo'>
                <span>{user.displayName}</span>
              </div>
            </div>
          ))}
        </>
      )}
      { err && <span className='error'>user not found</span>}
    </div>
  );
}

export default Search;
