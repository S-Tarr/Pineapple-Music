import React from 'react'
import Moment from 'react-moment'

function ChatMessage({ message }) {
    return (
        <div className="message_wrapper">
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