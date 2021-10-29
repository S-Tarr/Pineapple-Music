import React, { useState, useEffect, createRef } from 'react';
import { Button } from '@mui/material';
import Picker from 'emoji-picker-react';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';
import app from '../../firebase';
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, where, addDoc, query, orderBy, limit, getDocs, onSnapshot, Timestamp } from "firebase/firestore";

let currentUser = null;

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

const MessageForm = () => {
    currentUser = auth.currentUser;
    const [text, setText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        await addDoc(collection(db, 'messages', currentUser.uid, 'chat'), {
            text,
            from: currentUser.uid,
            createdAt: Timestamp.fromDate(new Date())
        });
        setText("");
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
        <form className="message-footer">
            <div className="emoji-icon">
            {showEmojis ? <ReactionPicker /> : <div></div>}
            <Button onClick={togglePicker}><AddReactionIcon /></Button>
            </div>
            <div className="input-field">
                <input
                  type="text"
                  readOnly="true"
                  placeholder="Enter reaction"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
            </div>
            <div className="send-button">
                <Button onClick={handleSubmit}><SendIcon /></Button>
            </div>
        </form>
    )
}

export default MessageForm;