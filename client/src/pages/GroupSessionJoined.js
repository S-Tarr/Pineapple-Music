
import GroupSessionSettings from "../components/GroupSession/GroupSessionSettings";

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
  query, 
  where,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
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

let currUser = null;
const db = getFirestore(app);
const auth = getAuth();
const inputRef = createRef();
const inputRef2 = createRef();

const HandleUpdate = () => {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

function GetUser(currGroupSession, history) {
    currUser = auth.currentUser.uid;
    let userDocId = null;
    let docData = null;
    
    const userRef = collection(db, "users");
    const user = query(
        userRef,
        where("uid", "==", currUser)
    );
    
    const groupSessionRef = collection(db, "groupSessions");
    const groupSession = query(
        groupSessionRef,
        where("sessionId", "==", currGroupSession)
    )
    getDocs(groupSession).then((querySnapshot) => {
        querySnapshot.forEach((data_doc) => {
            docData = data_doc.data();
            console.log(data_doc.id);
            const newList = docData.users;

            console.log(newList);
            delete newList[currUser];
        
            updateDoc(doc(db, "groupSessions", data_doc.id), {
                users: newList
            });
        });
    });

    getDocs(user).then((querySnapshot) => {
        querySnapshot.forEach((data_doc) => {
            userDocId = data_doc.id;
            docData = data_doc.data();
            
            const newList = docData.groupSessions.splice(docData.groupSessions.indexOf(currGroupSession), 1);
            
            console.log("data_doc.data().groupSessions: ", data_doc.data().groupSessions);
            console.log("docData.groupSessions: ", docData.groupSessions);
            console.log("currentGroupSession: ", currGroupSession);
            updateDoc(doc(db, "users", userDocId), {
                groupSessions: docData.groupSessions,
                leftGroupSessions: arrayUnion(currGroupSession),
            });
        });
    });
    history.push({
        pathname: '/creategroup',
    });
}

function GroupSessionJoined (props) {
    const history = useHistory();
    console.log("currentUser GSJ: ", auth.currentUser.uid); //THOMAS

    const [title, setTitle] = useState("");
    const [sessionId, setSessionId] = useState();
    const [imageUrl, setImage] = useState("");
    const [username, setUsername] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [show, setShow] = useState(false);
    const [leave, setLeave] = useState(false);
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
    }, [title]);

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

    const handleLeave = (setLeave, setOpacity, setColor) =>{
        setLeave(!leave);
        if (opacity == 1) {
            setOpacity(0.5);
            setColor("rgba(" +40 + "," + 40 + "," + 40 + "," + 1 + ")");
        }
        else {
            setOpacity(1);
            setColor("rgba(" +40 + "," + 40 + "," + 40 + "," + 0.2 + ")");
        }
    };

    const handleRedirectOnLeave = () => {
        //FIND CURRENT USER AND FUCK THAT SHIT UP REAL QUICK
    }
    
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

                        {sessionId ? <div style={{backgroundColor:"#202020"}}><GroupSessionQueueDisplay sessionId={sessionId} title={title}></GroupSessionQueueDisplay></div>
                        : <div></div>
                        }
                        
                    </div>
                    )}
                </Overlay>

                <Button variant="danger" ref={inputRef2} onClick={() => handleLeave(setLeave, setOpacity, setColor)}>
                    Leave Current Group?
                </Button>
                <Overlay target={inputRef2.current} show={leave} placement="left">
                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                    <div
                        {...props}
                        style={{
                            display: "flex",
                            flexDirection:"column",
                            margin:"50px",
                            backgroundColor: 'white',
                            width:"300px",
                            height:"200px",
                            borderRadius: 50,
                            textAlign:"center",
                            ...props.style,
                        }}
                    >
                        <text>Would You Like to leave the group session?</text>
                        <Button onClick={() => GetUser(sessionId, history)}>LEAVE</Button>
                        <Button onClick={() => handleLeave(setLeave, setOpacity, setColor)}>Back to Group Session</Button>
                    </div>
                    )}
                </Overlay>
                <UserList sessionId={sessionId} style={{ marginLeft: "auto", marginTop: "3rem" }} />
                {sessionId ? <div>
                    <GroupSessionSettings sessionId={sessionId} style={{ marginLeft: "auto", marginTop: "3rem" }} />
                </div> : <div></div>
                }
            </div>
            {sessionId ? <div>
                <ChatRoom groupSessionID={sessionId} groupSessionTitle={title}/>
            </div> : <div></div>
            }
        </div>
    );
    
}

export default GroupSessionJoined

//<UserList sessionId={this.state.sessionId} style={{ marginLeft: "auto", marginTop: "3rem" }} />
//<GroupSessionSettings sessionId={this.state.sessionId} style={{ marginLeft: "auto", marginTop: "3rem" }} />
