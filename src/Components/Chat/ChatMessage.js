import React from 'react'
import Moment from 'react-moment'
import "./ChatMessage.css"

function ChatMessage({ message, fromUser }) {
    return (
      <div className={`message-wrapper ${message.uid === fromUser ? "me" : "other"}`}>
        <p>
          From: {message.uid}
          <br />
          {message.text}
          <br />
          <small>
            <Moment fromNow>{message.createdAt.toDate()}</Moment>
          </small>
        </p>
      </div>
    )
}

export default ChatMessage;