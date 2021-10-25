import React, { useState, useEffect } from 'react'
import ChatMessage from '../components/ChatMessage'
import app from "../firebase";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, where, addDoc, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore";
import './Pages.css';

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

function GetChatMessages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const messagesRef = collection(db, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt'), limit(25))
        const unsubscribe = onSnapshot(messagesQuery, querySnapshot => {
            let messages = [];
            querySnapshot.forEach(doc => {
                messages.push(doc.data());
            })
            setMessages(messages)
        })
        return () => unsubscribe;
      }, [])
    
    return messages;
}

function MessageList() {
    const messages = GetChatMessages();
    return <div>
                {messages.length ? messages.map((message, i) => <ChatMessage key={i} message={message} />) : null}
           </div>
}

const ChatRoom = () => {
  const [users, setUsers] = useState([])

//   useEffect(() => {
//     const usersRef = collection(db, 'users');
//     const usersQuery = query(usersRef, where('uid', 'not-in', [auth.currentUser.uid]), limit(10));
//     const unsubscribe = onSnapshot(usersQuery, querySnapshot => {
//         let users = [];
//         querySnapshot.forEach(doc => {
//           users.push(doc.data());
//         })
//         setUsers(users);
//     })
//     return () => unsubscribe;
//   }, [])

//   console.log("users: ", users);

  return <div className="home-container Page">
      <div className="messages-container">
        <MessageList />
      </div>
    </div>
}

export default ChatRoom;