import React, { useEffect, useRef, useState } from "react";
import app from "../firebase";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    collection,
    updateDoc,
    getDocs,
    doc,
    query,
    orderBy,
    onSnapshot, 
} from "firebase/firestore";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import HistoryCard from '../components/History/HistoryCard';
import Divider from '@mui/material/Divider';
import { useAuth } from "../contexts/AuthContext";

const auth = getAuth(); // Authorization component
const db = getFirestore(app); // Firestore database

function History() {
    const { searchGroupSessions, getFormattedDate } = useAuth();

    var date = new Date();
    var dateTime = date.toLocaleDateString();

    const props = {
        title: "default title",
        username: "default username",
        createdAt: "default createdAt",
        sessionId: 1234,
    };

    const [trigger, setTrigger] = useState(true);
    const [cards, addCard] = useState([]);
    const [pastCards, addPastCard] = useState([]);

    if (trigger) {
        let currGroupSessions = new Set();
        let currLeftGroupSessions = new Set();
        getDocs(collection(db, "users"))
        .then((docSnap) => { 
            docSnap.forEach((doc) => {
            if (doc.data().uid === auth.currentUser.uid) {
                if (
                doc.data().groupSessions !== undefined &&
                doc.data().groupSessions != null &&
                doc.data().groupSessions !== "undefined"
                ) {
                doc
                    .data()
                    .groupSessions.forEach((item) => currGroupSessions.add(item));
                doc
                    .data()
                    .leftGroupSessions.forEach((item) => currLeftGroupSessions.add(item));
                }
            }
            });
        })
        .then(() => {
            const sessionsRef = collection(db, "groupSessions");
            const sessionsQuery = query(sessionsRef, orderBy("createdAt"));
            onSnapshot(sessionsQuery, (querySnapshot) => {
            addCard([]);
            querySnapshot.forEach((doc) => {
                const props = {
                title: "group session1",
                username: "username goes here",
                createdAt: "",
                sessionId: 1234,
                };
                if (currGroupSessions.has(doc.data().sessionId)) {
                var date = getFormattedDate(
                    new Date(doc.data().createdAt.seconds * 1000)
                );
                props["createdAt"] = date;
                props["title"] = doc.data().name;
                props["username"] = doc.data().ownerUid;
                props["sessionId"] = doc.data().sessionId;
                addCard((cards) => [props, ...cards]);
                }
                if (currLeftGroupSessions.has(doc.data().sessionId)) {
                var date = getFormattedDate(
                    new Date(doc.data().createdAt.seconds * 1000)
                );
                props["createdAt"] = date;
                props["title"] = doc.data().name;
                props["username"] = doc.data().ownerUid;
                props["sessionId"] = doc.data().sessionId;
                addPastCard((cards) => [props, ...cards]);
                }
            });
            });
        });
        setTrigger(false);
    }
    

    return <div className="Page home">
                <h1>History</h1>
                {console.log("cards: ", cards)}
                {console.log("pastCards: ", pastCards)}
                
                <Box sx={{ width: '100%', maxWidth: 360 }}>
                    <List>
                        {cards.map((card) => (
                            <HistoryCard props={card} activeRoom={true}/>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {pastCards.map((card) => (
                            <HistoryCard props={card} activeRoom={false}/>
                        ))}
                    </List>
                </Box>
            </div>
}

export default History;