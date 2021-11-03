import { useState, useEffect, createRef} from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';
import { useDrag, useDrop } from 'react-dnd';
import app from "../firebase";
import SearchBar from '../components/SearchBar';
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
        <div ref={drag}>{props.item}</div>
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

const handleDelete = (items, setItems, index2) => {
    var cloneArray = items.filter((item, index) => index !== index2)
    //set new docs in the firebase
    ChangeDoc(cloneArray, setItems);
}

async function ChangeDoc (cloneArray, setItems) {
    const docRef = await setDoc(doc(db, "groupSessionQueue", groupSessionQueueId), {
        createdAt: groupSessionQueueDoc.createdAt, sessionId: groupSessionQueueDoc.sessionId, queueId: groupSessionQueueDoc.queueId, songs: cloneArray
    });
    setItems([...cloneArray]);
    window.location.reload(false);
}

function GroupSessionQueueDisplay(props) {
    const cars = ["Island - Seven Lions", "Heat Check - Flight", "Sunday Morning - Maroon 5" , "Hotline Bling - Drake"];

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

    const handleDrop = (array, index, item) => {
        if (array) {
            // setItems(array.filter((value, currIndex)=> currIndex != index));
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
            setItems([...array]);
        }
    };

    return (
        <div>
            <Button variant="danger" ref={inputRef} onClick={handleFilter}>ADD SONG</Button>
            <Overlay target={inputRef.current} show={showSearch} placement="bottom">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (

                    <div {...props}>
                        <div style={{backgroundColor: "whitesmoke"}}>
                            <SearchBar placeholder="Enter a song name..." spotifyData={""} authorized={true} />
                            <Button
                                variant="outlined"
                                color="primary"
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