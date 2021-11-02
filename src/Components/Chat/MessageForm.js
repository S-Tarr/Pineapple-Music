import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Picker from "emoji-picker-react";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from "@mui/icons-material/Send";
import app from "../../firebase";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import "./MessageForm.css";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

const MessageForm = ({ groupSessionID, muted, setMuted, messagesWaiting, setMessagesWaiting }) => {
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "messages", groupSessionID, "chat"), {
      text,
      from: auth.currentUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
    });
    setText("");
  };

    const muteReactions = () => {
        setMuted(!muted);
        setMessagesWaiting(false);
    }

  const togglePicker = () => {
    setShowEmojis(!showEmojis);
  };

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
          <Button onClick={muteReactions}>
            {(messagesWaiting && muted) ? <NotificationsActiveIcon color="primary"/> : <NotificationsOffIcon color="disabled"/>}
          </Button>
        </div>
        <div className="emoji-icon">
          <Button onClick={togglePicker}>
            <AddReactionIcon />
          </Button>
        </div>
        <div className="input-field">
          <TextField
            type="text"
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            placeholder="Enter reaction"
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="send-button">
          <Button onClick={handleSubmit}>
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
