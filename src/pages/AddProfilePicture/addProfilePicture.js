import './addProfilePic.css';
import React from "react";
import { useEffect, useState } from "react";
import Firebase from '../../firebase';
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";

let currentUser = null;
let photo = null;
const auth = getAuth();

//not done

export default class AddProfilePicture extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            picture: false,
            src: false
        }

        onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            currentUser = auth.currentUser;
            photo = currentUser.photoURL;
            if (photo != null) {
                this.setState({
                    src: photo
                });
            }
            // ...
        } else {
            // User is signed out
            // ...
            console.log("NOT CORRECT");
        }
        });
    }

    handlePictureSelected(event) {
        var picture = event.target.files[0];
        var src     = URL.createObjectURL(picture);
        photo = src;
        
        updateProfile(auth.currentUser, {
            photoURL: photo
        }).then(() => {
        // Profile updated!
        // ...
            console.log("PROFILE UPDATED");
            console.log(currentUser.photoURL);
        }).catch((error) => {
        // An error occurred
        // ...
            console.log("PROFILE NOT UPDATED");
        });
      
        this.setState({
          picture: picture,
          src: src
        });
    }

    render() {
        console.log("HELLO@");
        console.log(this.state.src);
        return (
            <div className="profile-header">
                <div>
                    <text className="text">Upload Profile Image</text>
                    <input type="file" onChange={this.handlePictureSelected.bind(this)}/>
                </div>
                <div className="image-container">
                    <img src={this.state.src} className="App-logo"/>
                </div>
            </div>
          )
    }
}

// export default AddProfilePicture;