import React, { useState, useEffect } from 'react';
import ChatMessage from '../components/Chat/ChatMessage';
import MessageForm from '../components/Chat/MessageForm';
import app from "../firebase";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, where, addDoc, query, orderBy, limit, getDocs, onSnapshot, Timestamp } from "firebase/firestore";
import './Pages.css';

let currentUser = null;

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
  const [text, setText] = useState("");

  return <div className="home-container Page">
      <div className="messages-container">
        <MessageList />
        <MessageForm 
        />
      </div>
    </div>
}

export default ChatRoom;