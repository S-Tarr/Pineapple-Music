import React, { useState, Button } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";

import SearchIcon from "@material-ui/icons/Search";
import { useLocation } from "react-router-dom";

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


export default class GroupSessionJoined extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            title: props.location.props.title,
            sessionId: props.location.props.sessionId,
            imageUrl: props.location.props.imageUrl, 
            username: props.location.props.username, 
            createdAt: props.location.props.createdAt
        }
    }
    render () {
        // const groupSession = useLocation();
        return (
            <div className="Page">
                <Typography gutterBottom variant="h5" component="div">
                    {this.state.title}
                </Typography>
                <text>Session ID: </text>
                <Typography gutterBottom variant="h5" component="div">
                    {this.state.sessionId}
                </Typography>
                <div className="container">
                    <text>Group Session Song Queue</text>
                    <SearchIcon></SearchIcon>
                </div>
            </div>
      );
    }
}
