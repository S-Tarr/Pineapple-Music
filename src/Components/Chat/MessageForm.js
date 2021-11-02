import React, { useState, useEffect, createRef } from 'react';
import { Button } from '@mui/material';
import Picker from 'emoji-picker-react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import app from '../../firebase';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import "./MessageForm.css";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

const MessageForm = ({ groupSessionID, muted, setMuted }) => {
    const [text, setText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        await addDoc(collection(db, 'messages', groupSessionID, 'chat'), {
            text,
            from: auth.currentUser.uid,
            createdAt: Timestamp.fromDate(new Date())
        });
        setText("");
    }

    const muteReactions = () => {
        setMuted(!muted);
        console.log("muted:" , muted);
    }

    const togglePicker = () => {
        setShowEmojis(!showEmojis);
    }

    const ReactionPicker = () => {
        const onEmojiClick = (event, emojiObject) => {
          setText(text + emojiObject.emoji);
        };
      
        return (
          <div>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        );
    };

    return (
        <div className="message-footer">
            {showEmojis ? <ReactionPicker /> : <div></div>}
            <div className="message-inputs">
                <div className="mute-button">
                    <Button onClick={muteReactions}><MicOffIcon /></Button>
                </div>
                <div className="emoji-icon">
                    <Button onClick={togglePicker}><AddReactionIcon /></Button>
                </div>
                <div className="input-field">
                    <span><input
                    type="text"
                    readOnly="true"
                    placeholder="Enter reaction"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    /></span>
                </div>
                <div className="send-button">
                    <Button onClick={handleSubmit}><SendIcon /></Button>
                </div>
            </div>
        </div>
    )
}

export default MessageForm;