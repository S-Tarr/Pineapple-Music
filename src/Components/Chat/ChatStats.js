import React from 'react'
import Moment from 'react-moment'
import "./ChatMessage.css"

function ChatStats({ message, currUser }) {
    return (
      <div className={`message-wrapper ${message.from === currUser ? "me" : "other"}`}>
        <p>
          From: {message.from.substring(0, 5)}
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