import React, { useState, createRef, useEffect } from "react";

import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router";

import { Typography } from "@mui/material";
import ChatRoom from "../components/Chat/ChatRoom";
import UserList from "../components/GroupSession/UserList";

import app from "../firebase";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import GroupSessionQueueDisplay from "../components/GroupSession/GroupSessionQueueDisplay";

const pgStyle = {
    "display": "flex",
    "position": "fixed"
}

const infoStyle = {

}

const chatStyle = {

}

const inputRef = createRef();
const inputRef2 = createRef();

const HandleUpdate = () => {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

function GroupSessionJoined (props) {
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [imageUrl, setImage] = useState("");
    const [username, setUsername] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [show, setShow] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [color, setColor] = useState("rgba(" +40 + "," + 40 + "," + 40 + "," + 0.2 + ")");
    const [buttonMessage, setButtonMessage] = useState("Open Song Queue");

    useEffect(() => {
        if (props.location.props == undefined) {
            const persistentData = localStorage.getItem("user-data");
            const data = JSON.parse(persistentData);
    
            setTitle(data.title);
            setSessionId(data.sessionId);
            setImage(data.imageUrl);
            setUsername(data.username);
            setCreatedAt(data.createdAt);
        }
        else {
            setTitle(props.location.props.title);
            setSessionId(props.location.props.sessionId);
            setImage(props.location.props.imageUrl);
            setUsername(props.location.props.userName);
            setCreatedAt(props.location.props.createdAt);
            
            localStorage.clear();
            const groupSessionData = {title: props.location.props.title, sessionId: props.location.props.sessionId, imageUrl: props.location.props.imageUrl, username: props.location.props.userName, createdAt: props.location.props.createdAt}
            localStorage.setItem("user-data", JSON.stringify(groupSessionData));
        }
    });

    HandleUpdate();

    const handleShow = (setShow, setOpacity, setColor, setButtonMessage) =>{
        setShow(!show);
        if (opacity == 1) {
            setOpacity(0.5);
            setColor("rgba(" +40 + "," + 40 + "," + 40 + "," + 1 + ")");
            setButtonMessage("Close Song Queue");
        }
        else {
            setOpacity(1);
            setColor("rgba(" +40 + "," + 40 + "," + 40 + "," + 0.2 + ")");
            setButtonMessage("Open Song Queue");
        }
    };

    const handleLeaveShow = (event) =>{
        // this.setState({
        //     leave :!this.state.leave,
        // });
        // if (this.state.opacity == 1) {
        //     this.setState({
        //         opacity :0.5,
        //         color : "rgba(" +40 + "," + 40 + "," + 40 + "," + 1 + ")",
        //         buttonMessage:"Close Song Queue",
        //     })
        // }
        // else {
        //     this.setState({
        //         opacity :1,
        //         color : "rgba(" +40 + "," + 40 + "," + 40 + "," + 0.2 + ")",
        //         buttonMessage: "Open Song Queue",
        //     })
        // }
    };

    const handleSearchButton = (event) =>{
        // this.setState({
        //     showSearch: !this.state.showSearch,
        // })
    }  
    console.log("BRUHHH");
    console.log(sessionId);

    
    return (
        <div style={{backgroundColor: color, opacity: opacity}}>

            <div className="info-section" style={infoStyle}>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <text>Session ID: </text>
                <Typography gutterBottom variant="h5" component="div">
                    {sessionId}
                </Typography>

                <Button variant="danger" ref={inputRef} onClick={() => handleShow(setShow, setOpacity, setColor, setButtonMessage)}>
                    {buttonMessage}
                </Button>
                <Overlay target={inputRef.current} show={show} placement="bottom">
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                    <div
                        {...props}
                        style={{
                            display: "flex",
                            flexDirection:"column",
                            margin:"50px",
                            backgroundColor: "#202020",
                            padding: '2px 10px',
                            color: 'white',
                            width:"600px",
                            height:"500px",
                            borderRadius: 50,
                            textAlign:"center",
                            ...props.style,
                        }}
                    >
                        <text>Group Session Song Queue</text>

                        <div style={{backgroundColor:"#202020"}}><GroupSessionQueueDisplay sessionId={sessionId} title={title}></GroupSessionQueueDisplay></div>
                        
                    </div>
                    )}
                </Overlay>

                {/* <Button variant="danger" ref={inputRef2} onClick={handleLeaveShow.bind(this)}>
                    {buttonMessage}
                </Button>
                <Overlay target={inputRef2.current} show={leave} placement="bottom">
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                    <div
                        {...props}
                        style={{
                            display: "flex",
                            flexDirection:"column",
                            margin:"50px",
                            backgroundColor: "white",
                            padding: '2px 10px',
                            color: 'white',
                            width:"600px",
                            height:"500px",
                            borderRadius: 50,
                            textAlign:"center",
                            ...props.style,
                        }}
                    >
                        <text>Would You Like to leave the group session?</text>
                        
                    </div>
                    )}
                </Overlay> */}
                <UserList sessionId={sessionId} style={{ marginLeft: "auto", marginTop: "3rem" }} />
            </div>
            <div className="chat-section" style={chatStyle}>
                {/* <ChatRoom groupSessionID={sessionId} groupSessionTitle={title}/> */}
            </div>
        </div>
    );
    
}

export default GroupSessionJoined
