import React, { useState, useEffect, createRef } from 'react';
import { Button } from '@mui/material';
import Picker from 'emoji-picker-react';

const ReactionPicker = () => {
    const [chosenEmoji, setChosenEmoji] = useState(null);
  
    const onEmojiClick = (event, emojiObject) => {
      setChosenEmoji(emojiObject);
    };
  
    return (
      <div>
        <Picker onEmojiClick={onEmojiClick} />
      </div>
    );
};

const MessageForm = ({handleSubmit, text, setText}) => {
    return (
        <form className="message-form">
            <div>
                <input
                  type="text"
                  placeholder="Enter reaction"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button onClick={handleSubmit} placeholder="Send"/>
            </div>
        </form>
    )
}

export default MessageForm;