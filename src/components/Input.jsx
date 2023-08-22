import React from 'react'
import attach from '../images/attach.png'
import Img from "../images/img.png";
import { useState } from 'react'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { auth, db, storage } from '../Firebase'
import { Timestamp, arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { v4 as uuid } from "uuid";

function Input() {
  
  const [text,setText]=useState("")
  const [img, setImg] = useState();

  const { data } = useContext(ChatContext);

   const handleClick = (e) => {
    if (e.target.value!==''  && e.code === 'Enter' ) {
      handleSend();
    }
  };

  const handleSend = async () => {
  // Check if the chatroom exists
  if(text !==''){
    const chatDocRef = doc(db, "ChatRooms", data.chatId);
    const chatDocSnapshot = await getDoc(chatDocRef);
    const storageRef =  ref(storage, `imagesSent/${auth.currentUser.uid}/${uuid()}`);
    
    
  if (!chatDocSnapshot.exists()) {
   if (img) {
    const uploadTask =  uploadBytesResumable(storageRef, img);
     uploadTask.on(
       "state_changed",
          (snapshot) => {
        
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload error:", error);

        },
       async ()  => {

                await getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
                               await setDoc(chatDocRef, {
                                        messages: arrayUnion({
                                            id: uuid(),
                                            text,
                                            senderId: auth.currentUser.uid,
                                            date: Timestamp.now(),
                                            img: url,
                                        }),
                              });
                });
                             
           
        }
      );

        } else {
                          await setDoc(chatDocRef, {
                              messages: arrayUnion({
                                      id: uuid(),
                                      text,
                                      senderId: auth.currentUser.uid,
                                      date: Timestamp.now(),
                      
                                  }),
                          });
        }
  }else{
  if (img) {
const uploadTask =  uploadBytesResumable(storageRef, img);
    uploadTask.on(
      (error) => {
        // TODO: Handle Error
      },
     async () => {

           await getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
                          await updateDoc(chatDocRef, {
                                    messages: arrayUnion({
                                        id: uuid(),
                                        text,
                                        senderId: auth.currentUser.uid,
                                        date: Timestamp.now(),
                                        img: url,
                                    }),
                                }).then(() => {
                                    console.log("Document successfully updated!");
                                });
           } );
      }
    );
    } else {
    await updateDoc(chatDocRef, {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: auth.currentUser.uid,
        date: Timestamp.now(),
      }),
    });
  }
  }

 

  // Update last message and date for the current user
  await updateDoc(doc(db, "usersChat", auth.currentUser.uid), {
    [data.chatId + ".lastMessage"]: {
      text,
    },
    [data.chatId + ".date"]: serverTimestamp(),
  });

  // Update last message and date for the other user
  await updateDoc(doc(db, "usersChat", data.user.uid), {
    [data.chatId + ".lastMessage"]: {
      text,
    },
    [data.chatId + ".date"]: serverTimestamp(),
  });

  setText("");
  setImg(null);
  }
  
    
  
  
};

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleClick}
      />
      <div className="send">
        <img src={attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button  onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input
