import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../Firebase';

function Messages() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "ChatRooms", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
      
      // Check if the document has a new message
      if (doc.exists() && hasNewMessage(doc.data().messages)) {
        showNotification();
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  // Function to check if there is a new message
  const hasNewMessage = (newMessages) => {
    return newMessages.length > messages.length;
  };

  // Function to show a notification
  const showNotification = () => {
    if(messages.senderId!==auth.currentUser.uid){
  if (Notification.permission === 'granted') {
      new Notification('New Message', {
        body: 'You have a new message in the chat.',
        icon: '../images/ranya.png', // Replace with the path to your notification icon
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          showNotification();
        }
      });
    }
  };
    }
  

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
}

export default Messages;
