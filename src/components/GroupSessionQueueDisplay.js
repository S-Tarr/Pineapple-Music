import { useState, useEffect, createRef} from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';
import { useDrag, useDrop } from 'react-dnd';
import app from "../firebase";
import GroupSessionSearchBar from '../components/GroupSessionSearchBar';
import Track from './Track';
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
} from "firebase/firestore";

const db = getFirestore(app);

let sessionId;
let groupSessionQueueId;
let groupSessionQueueDoc;

const CLIENT_ID = "477666821b8941c4bd163b4ff55ed9af";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

const SPACE_DELIMITER = "%20";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/groupsessionhome"; //CHANGE LATER
const SCOPES = ["user-read-currently-playing", "user-read-playback-state"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const getParamsFromSpotifyAuth = (hash) => {
  const paramsUrl = hash.substring(1).split("&");
  const params = paramsUrl.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
  return params;
};

const handleSpotifyLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

function ExampleDrag(props) {
    //implement function for onDROP

    const [{ isDragging }, drag, dragPreview] = useDrag({
        
        type:'BOX',
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                props.handleDrop( props.items,props.index, props.item);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    return (
        <div ref={drag}>
            <Track track={props.item}></Track>
        </div>
    )
}

function Drop(props) {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        // The type (or types) to accept - strings or symbols
        accept: 'BOX',
        // Props to collect
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
        drop: (item, monitor) => {
            props.setDroppedIndex(props.index);
        }
      }))

    return (
        <div ref={drop}>
            <ExampleDrag item={props.item} index={props.index} handleDrop={props.handleDrop} type={'BOX'} items={props.items}></ExampleDrag>
        </div>
    )
}

function GetSongs(props) {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        setSongs([]);
        const groupSessionRef = collection(db, "groupSessions");
        const groupSession = query(
            groupSessionRef,
            where("sessionId", "==", sessionId)
        );
        let groupSessionId;
        getDocs(groupSession).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                groupSessionId = doc.id;

                const groupSessionQueueRef = collection(db, "groupSessionQueue");

                const groupSessionQueue = query(
                    groupSessionQueueRef,
                    where("queueId", "==" , groupSessionId)
                )
                getDocs(groupSessionQueue).then((querySnapshot) => {
                    let SongsInSession = [];
                    querySnapshot.forEach((doc) => {
                        groupSessionQueueId = doc.id;
                        groupSessionQueueDoc = doc.data();
                        SongsInSession = doc.data().songs;
                    });
                    setSongs(SongsInSession);
                });
            });
          });

    }, []);
    console.log(songs);
    return songs;
}

const inputRef = createRef();

function GroupSessionQueueDisplay(props) {
    const cars = ["Island - Seven Lions", "Heat Check - Flight", "Sunday Morning - Maroon 5" , "Hotline Bling - Drake"];
    
    const [authorized, setAuthorized] = useState(true);
    const [token, setToken] = useState({})


    useEffect(() => {
        if (window.location.hash) {
        setToken(getParamsFromSpotifyAuth(window.location.hash).access_token);
        console.log(token);
        setAuthorized(false);
        }
    }, [authorized]);

    sessionId = props.sessionId;

    const [items, setItems] = useState(cars);

    var songs = GetSongs();
    useEffect(() =>{
        setItems(songs);
    })

    const [droppedIndex, setDroppedIndex] = useState();
    const [showSearch, setShowSearch] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const handleFilter = (event) => {
        setShowSearch(!showSearch);
    };

    const handleDeleteButton = (event) => {
        setShowDelete(!showDelete);
    }

    const handleDelete = (items, setItems, index2) => {
        var cloneArray = items.filter((item, index) => index !== index2)
        //set new docs in the firebase
        ChangeDoc(cloneArray, setItems, "delete");
    }
    
    async function ChangeDoc (cloneArray, setItems, type) {
        const docRef = await setDoc(doc(db, "groupSessionQueue", groupSessionQueueId), {
            createdAt: groupSessionQueueDoc.createdAt, sessionId: groupSessionQueueDoc.sessionId, queueId: groupSessionQueueDoc.queueId, songs: cloneArray
        });
        setItems([...cloneArray]);
        if (type == "delete") {
            window.location.reload(false);
        }
        // window.location.reload(false);
    }
    
    const handleDrop = (array, index, item) => {
        if (array) {
            if (droppedIndex < index) {
                var temp = array[droppedIndex];
                array[droppedIndex] = item;
                for (var a = droppedIndex+1; a <=index; a++) {
                    var temp2 = array[a];
                    array[a] = temp;
                    temp = temp2;
                }
            }
            else if (droppedIndex > index) {
                for (var a = index; a < droppedIndex; a++) {
                    array[a] = array[a + 1];
                }
                array[droppedIndex] = item;
            }
            else {
                //do nothing
            }
            ChangeDoc(array,setItems, "");
        }
    };

    return (
        <div>
            <Button variant="danger" ref={inputRef} onClick={handleFilter}>ADD SONG</Button>
            <Overlay target={inputRef.current} show={showSearch} placement="bottom">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (

                    <div {...props}>
                        <div style={{backgroundColor: "whitesmoke"}}>
                        
                            <GroupSessionSearchBar placeholder="Enter a song name..." spotifyData={token} authorized={authorized} groupSessionQueueDoc={groupSessionQueueDoc} groupSessionQueueId={groupSessionQueueId}/>
                            
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleSpotifyLogin}
                            >
                                Login to Spotify
                            </Button>
                        
                        
                        </div>
                    </div>
                )}
            </Overlay>
            
            <Button variant="danger" onClick={handleDeleteButton}>DELETE SONG</Button>
            {items.map((number, index) => {
                return (
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                        <Drop item={number} index={index} type={'BOX'} setDroppedIndex={setDroppedIndex} handleDrop={handleDrop} items={items}></Drop>
                        {showDelete == true && <Button variant="danger" onClick={() => handleDelete(items, setItems, index)}>X</Button>}
    
                    </div>
                )   
            })}

        </div>
        
    )
}

export default GroupSessionQueueDisplay;