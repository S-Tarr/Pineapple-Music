import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import MessageForm from "./MessageForm";
import app from "../../firebase";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import "../../pages/Pages.css";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

const msgLstStyle = {
  "padding-bottom": "200px",
  "position": "fixed",
  "height": "100%",
  "width": "100%",
  "overflow-y": "scroll",
  "background-image": "linear-gradient(90deg, #3a9c, #4f7a)",
};

const userListStyle = {
  marginLeft: "auto",
  marginRight: "0rem",
};

function GetChatMessages(groupSessionID, setMessagesWaiting) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "messages", groupSessionID, "chat");
    const messagesQuery = query(messagesRef, orderBy("createdAt"), limit(25));
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages(messages);
      setMessagesWaiting(true);
    });
    return () => unsubscribe;
  }, []);

  console.log("messages: ", messages);
  return messages;
}

function MessageList({ groupSessionID, muted, setMessagesWaiting}) {
  const messages = GetChatMessages(groupSessionID, setMessagesWaiting);

  if (muted === false) {
    return (
      <div style={msgLstStyle}>
        {messages.length
          ? messages.map((message, i) => (
              <ChatMessage
                key={i}
                message={message}
                currUser={auth.currentUser.uid}
              />
            ))
          : null}
      </div>
    );
  } else {
    return <div></div>
  }
}

const ChatRoom = ({ groupSessionID }) => {
  const [muted, setMuted] = useState(false);
  const [messagesWaiting, setMessagesWaiting] = useState(false);

  return (
    <>
      <div className="messages-container-page">
        <div>
          <MessageList groupSessionID={groupSessionID} muted={muted} setMuted={setMuted} setMessagesWaiting={setMessagesWaiting}/>
        </div>
        <div>
          <MessageForm groupSessionID={groupSessionID} muted={muted} setMuted={setMuted} messagesWaiting={messagesWaiting} setMessagesWaiting={setMessagesWaiting}/>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
