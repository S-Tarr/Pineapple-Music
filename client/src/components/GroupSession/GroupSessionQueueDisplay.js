import { useState, useEffect, createRef} from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';
import { useDrag, useDrop } from 'react-dnd';
import app from "../../firebase";
import GroupSessionSearchBar from './GroupSessionSearchBar';
import GroupSessionPlaylistSearchBar from './GroupSessionPlaylistSearchBar';
import Track from '../Track';
import Player from './GroupSpotifyPlayer'
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import TimeContextProvider from '../../contexts/TimeContext';
import Canvas from '../Canvas';

const db = getFirestore(app);

let sessionId;
let groupSessionQueueId;
let groupSessionId;
let groupSessionQueueDoc;

const inputRef = createRef();
const inputRef2 = createRef();
const inputRef3 = createRef();

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
    const [showPlaylistContents, setShowPlaylistContents] = useState(false);
    const [playlistContents, setPlaylistContents] = useState(props.item.tracks);

    const handleFilter = (event) => {
        setShowPlaylistContents(!showPlaylistContents);
    };

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
            {/* <Track track={props.item}></Track> */}
            <div
                className="d-flex m-2 align-items-center"
                style={{ cursor: "pointer", display:"flex", flexDirection:'row' }}
                >
                
                {/*FIX BELOW SO THAT IT DOESN't ONLY DO IT FOR INDEX 1*/}
                {props.item.tracks && props.index === 0 ? 
                (<div style={{backgroundColor:"black", marginBottom: 20}}>
                    <div style={{marginBottom:10}}>Playing From Playlist</div>
                    <div style={{display:'flex', flexDirection: 'row'}}>
                        <img src={props.item.albumUrl} style={{ height: "64px", width: "64px" }} />
                        <div>
                            {props.item.title}
                            <div className="text-muted">{props.item.artist}</div>
                        </div>
                    </div>
                    <Button variant="danger" ref={inputRef3} onClick={handleFilter}>Display Contents</Button>
                    <Overlay target={inputRef3.current} show={showPlaylistContents} placement="bottom">
                        {({ placement, arrowProps, show: _show, popper, ...props }) => (
                            <div {...props}>

                                <div style={{backgroundColor: "whitesmoke"}}>
                                    {/*incorportate the below */}
                                    {playlistContents.map((track, index) => {
                                        return (
                                            <div>
                                                { index < 5 ? 
                                                <div style={{ backgroundColor: "black" }}>
                                                    <div style={{display:'flex', flexDirection: 'row'}}>
                                                        <img src={track.track.album.images[0].url} style={{ height: "64px", width: "64px" }} />
                                                        <div className="ml-3" style={{color:'white'}}>
                                                            <div>{track.track.name}</div>
                                                            <div className="text-muted">{track.track.artists[0].name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : <div>
                                                </div>
                                                }
                                            </div>
                                        )   
                                    })}
                                </div>
                            </div>
                        )}
                    </Overlay>
                </div>) : 
                (<div>
                    <img src={props.item.albumUrl} style={{ height: "64px", width: "64px" }} />
                    <div className="ml-3">
                        <div>{props.item.title}</div>
                        <div className="text-muted">{props.item.artist}</div>
                    </div>
                </div>)}

            </div>
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
    return songs;
}

// THOMAS
function GetPermissions(sessionId, setQueueing, setPps, setShowSearch, setShowPlaylistSearch) {
    useEffect(() => {
      const groupSessionRef = collection(db, "groupSessions");
      const groupSession = query(
        groupSessionRef,
        where("sessionId", "==", sessionId)
      );
      const unsubscribe = onSnapshot(groupSession, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setQueueing(doc.data().queueing);
          if (doc.data().queueing == false) {
            setShowSearch(false);
            setShowPlaylistSearch(false);
          }
          setPps(doc.data().pps);
        });
      })
      return () => unsubscribe;
    }, [sessionId]);
}
//

function GroupSessionQueueDisplay(props) {
    const cars = ["Island - Seven Lions", "Heat Check - Flight", "Sunday Morning - Maroon 5" , "Hotline Bling - Drake"];
    
    const [droppedIndex, setDroppedIndex] = useState();
    const [showSearch, setShowSearch] = useState(false);
    const [showPlaylistSearch, setShowPlaylistSearch] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [offset, setOffset] = useState(0);

    const [authorized, setAuthorized] = useState(true);
    const [token, setToken] = useState({})

    const { checkCreator } = useAuth();
    const [queueing, setQueueing] = useState();
    const [pps, setPps] = useState();
    const [isOwner, setIsOwner] = useState(false);
    const isOwnerPromise = checkCreator(sessionId)
        .then((result) => {
            return result;
        });
    const useOwnerPromise = () => {
        isOwnerPromise.then((result) => {
        if (result) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
        });
    };

    useEffect(() => {
        const groupSessionRef = collection(db, "groupSessions");
        const groupSession = query(
            groupSessionRef,
            where("sessionId", "==", sessionId)
        );
        getDocs(groupSession).then((querySnapshot) => {
            querySnapshot.forEach((newdoc) => {
                let tempOffset = newdoc.data().queueOffset;
                setOffset(tempOffset);
            });
        });
    }, [offset])

    useOwnerPromise();
    GetPermissions(sessionId, setQueueing, setPps, setShowSearch, setShowPlaylistSearch);

    useEffect(() => {
        if (window.location.hash) {
        setToken(getParamsFromSpotifyAuth(window.location.hash).access_token);
        setAuthorized(false);
        }
    }, [authorized]);
    
    sessionId = props.sessionId;

    const [items, setItems] = useState(cars);

    var songs = GetSongs();
    useEffect(() =>{
        setItems(songs);
    })

    const handleFilter = (event) => {
        setShowSearch(!showSearch);
    };

    const handleShowPlaylist = (event) => {
        setShowPlaylistSearch(!showPlaylistSearch);
    };

    const handleDeleteButton = (event) => {
        setShowDelete(!showDelete);
    }

    const handleDelete = (items, setItems, index2) => {
        console.log(offset);
        if (offset != 0) {  
            updateDoc(doc(db, "groupSessions", groupSessionId), {
                queueOffset: offset - 1
            });
        }
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

    const [visuals, setVisuals] = useState(false);
    const [text, setText] = useState("Visuals");

    const toggleVisuals = () => {
        if (visuals) {
            setVisuals(false);
        }
        else {
            setVisuals(true);
        }
    }
    const toggleText = () => {
        if (visuals) {
            setText("Visuals");
        }
        else {
            setText("Song");
        }
    }

    return (
        <div>
            <Button variant="danger" ref={inputRef} onClick={handleFilter} disabled={!isOwner & !queueing}>ADD SONG</Button>
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

            <Button variant="danger" ref={inputRef2} onClick={handleShowPlaylist} disabled={!isOwner & !queueing}>ADD PLAYLIST</Button>
            <Overlay target={inputRef2.current} show={showPlaylistSearch} placement="bottom">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (

                    <div {...props}>
                        <div style={{backgroundColor: "whitesmoke"}}>
                            {/*REPLACE BELOW */}
                            <GroupSessionPlaylistSearchBar placeholder="Enter a song name..." spotifyData={token} authorized={authorized} groupSessionQueueDoc={groupSessionQueueDoc} groupSessionQueueId={groupSessionQueueId}/>
                            
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

            <Button variant="danger" onClick={handleDeleteButton} disabled={!isOwner & !queueing}>DELETE SONG</Button>
            {items.map((number, index) => {
                return (
                    <div>
                        {/*index >= offset ? */
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                                <Drop item={number} index={index} type={'BOX'} setDroppedIndex={setDroppedIndex} handleDrop={handleDrop} items={items}></Drop>
                                {showDelete == true && <Button variant="danger" onClick={() => handleDelete(items, setItems, index)}>X</Button>}
                            </div> /*:
                            <div></div>*/
                        }
                    </div>
                )   
            })}
            <Button variant="text"
            onClick={() => {toggleVisuals(); toggleText()}}>
                {text}
            </Button>
            <div>
                <TimeContextProvider>
                    {visuals ?
                        <Canvas/>
                    :
                        null
                    }
                    <Player groupSessionQueueId={groupSessionQueueId} groupSessionQueueDoc={groupSessionQueueDoc} sessionId={sessionId} docId={groupSessionId}/>
                </TimeContextProvider>
            </div>
        </div>
        
        
    )
}

export default GroupSessionQueueDisplay;