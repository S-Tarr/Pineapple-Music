import React from 'react'
import useAuth from "../GetSpotifyAuth"
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, updateDoc, getDocs, doc } from "firebase/firestore";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HistoryCard from '../components/History/HistoryCard';
import Divider from '@mui/material/Divider';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

const props = {
    title: "default title",
    username: "default username",
    createdAt: "default createdAt",
    sessionId: 1234,
  };

function History() {
    return <div className="Page home">
                <h1>History</h1>
                
                <Box sx={{ width: '100%', maxWidth: 360 }}>
                    <List>
                        <HistoryCard props={props} activeRoom={true}/>
                        <HistoryCard props={props} activeRoom={true}/>
                    </List>
                    <Divider />
                    <List>
                        <HistoryCard props={props} activeRoom={false}/>
                        <HistoryCard props={props} activeRoom={false}/>
                    </List>
                </Box>
            </div>
}

export default History;