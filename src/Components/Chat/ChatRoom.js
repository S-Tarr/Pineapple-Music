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

import UserList from "../UserList";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

const msgLstStyle = {
  "padding-bottom": "50px",
  position: "fixed",
  height: "100%",
  width: "81%",
  "overflow-y": "scroll",
  "background-image": "linear-gradient(90deg, #3a9c, #4f7a)",
};

const userListStyle = {
  marginLeft: "auto",
  marginRight: "0rem",
};

function GetChatMessages(groupSessionID, muted) {
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
    });
    return () => unsubscribe;
  }, []);

  return messages;
}

function MessageList({ groupSessionID, muted }) {
  const messages = GetChatMessages(groupSessionID, muted);

  console.log("muted: ", muted)
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

  return (
    <>
      <div className="messages-container-page">
        <div>
          <MessageList groupSessionID={groupSessionID} muted={muted} setMuted={setMuted}/>
        </div>
        <div>
          <MessageForm groupSessionID={groupSessionID} muted={muted} setMuted={setMuted}/>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UserList
            sessionId={groupSessionID}
            style={{ marginLeft: "auto", marginTop: "3rem" }}
          />
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
