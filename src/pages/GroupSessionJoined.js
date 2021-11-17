import React, { useState, createRef } from "react";

import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import { useDrag } from 'react-dnd';
import GroupSessionQueueDisplay from "../components/GroupSession/GroupSessionQueueDisplay";

const pgStyle = {
    "display": "flex",
    "position": "fixed"
}

const infoStyle = {

}

const chatStyle = {

}

export default class GroupSessionJoined extends React.Component{
    constructor (props) {
        super(props);
        this.inputRef = createRef();
        this.inputRef2 = createRef();
        
        console.log(props.location.props);
        if (props.location.props == undefined) {
            const persistentData = localStorage.getItem("user-data");
            const data = JSON.parse(persistentData);
            this.state = {
                title: data.title,
                sessionId: data.sessionId,
                imageUrl: persistentData.imageUrl, 
                username: persistentData.username, 
                createdAt: persistentData.createdAt,
                show :false,
                showSearch : false,
                opacity:1,
                color : "rgba(" +40 + "," + 40 + "," + 40 + "," + 0.2 + ")",
                buttonMessage :"Open Song Queue",
                isPlaying: false,
            }
        }
        else {
            this.state = {
                title: props.location.props.title,
                sessionId: props.location.props.sessionId,
                imageUrl: props.location.props.imageUrl, 
                username: props.location.props.userName, 
                createdAt: props.location.props.createdAt,
                show :false,
                showSearch : false,
                opacity:1,
                color : "rgba(" +40 + "," + 40 + "," + 40 + "," + 0.2 + ")",
                buttonMessage :"Open Song Queue",
                isPlaying: false,
            }
            localStorage.clear();
            const groupSessionData = {title: props.location.props.title, sessionId: props.location.props.sessionId, imageUrl: props.location.props.imageUrl, username: props.location.props.userName, createdAt: props.location.props.createdAt}
            localStorage.setItem("user-data", JSON.stringify(groupSessionData));
        }
        console.log(this.state);

    }
    handleShow (event) {
        this.setState({
            show :!this.state.show,
        });
        if (this.state.opacity == 1) {
            this.setState({
                opacity :0.5,
                color : "rgba(" +40 + "," + 40 + "," + 40 + "," + 1 + ")",
                buttonMessage:"Close Song Queue",
            })
        }
        else {
            this.setState({
                opacity :1,
                color : "rgba(" +40 + "," + 40 + "," + 40 + "," + 0.2 + ")",
                buttonMessage: "Open Song Queue",
            })
        }
    };

    handleSearchButton (event) {
        this.setState({
            showSearch: !this.state.showSearch,
        })
    }

    render () {
        // const groupSession = useLocation();
        const token = "";

        // const cars = ["Saab by Drake", "Volvo by Kanye West", "BMW by J-Cole" , "Volvo by Drake", "BMW" , "Volvo", "BMW" , "Volvo", "BMW"];
        // const listItems = cars.map((number) =>
        //     <li>{number}</li>
        // );

        return (
            <div style={{backgroundColor: this.state.color, opacity: this.state.opacity}}>

                <div className="info-section" style={infoStyle}>
                    <Typography gutterBottom variant="h5" component="div">
                        {this.state.title}
                    </Typography>
                    <text>Session ID: </text>
                    <Typography gutterBottom variant="h5" component="div">
                        {this.state.sessionId}
                    </Typography>

                    <Button variant="danger" ref={this.inputRef} onClick={this.handleShow.bind(this)}>
                        {this.state.buttonMessage}
                    </Button>
                    <Overlay target={this.inputRef.current} show={this.state.show} placement="bottom">
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

                            <div style={{backgroundColor:"#202020"}}><GroupSessionQueueDisplay sessionId={this.state.sessionId} title={this.state.title}></GroupSessionQueueDisplay></div>
                            
                        </div>
                        )}
                    </Overlay>
                    {/* <div className="Player-Div">
                        <button className="forward-rewind"><FastRewindRoundedIcon style={{ fontSize: 50 }}/></button>
                        <button className="playPauseButton"><PlayArrowRoundedIcon style={{ fontSize: 50 }}/></button>
                        <button className="forward-rewind"><FastForwardRoundedIcon style={{ fontSize: 50 }}/></button>
                    </div> */}
			<UserList sessionId={this.state.sessionId} style={{ marginLeft: "auto", marginTop: "3rem" }} />
                </div>
                {/* <div className="chat-section" style={chatStyle}> */}
                    <ChatRoom groupSessionID={this.state.sessionId} groupSessionTitle={this.state.title}/>
                {/* </div> */}
            </div>
      );
    }
}
