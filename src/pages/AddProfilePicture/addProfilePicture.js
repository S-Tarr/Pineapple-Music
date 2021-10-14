import './addProfilePic.css';
import React from "react";
import { useEffect, useState } from "react";
import Firebase from '../../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// const selectedFile = document.getElementById('file').files[0];

export default class AddProfilePicture extends React.Component{
    // const auth = getAuth();
    // const user = auth.currentUser;
    // if (user !== null) {
    // // The user object has basic properties such as display name, email, etc.
    // const displayName = user.displayName;
    // const email = user.email;
    // const photoURL = user.photoURL;
    // const emailVerified = user.emailVerified;

    // // The user's ID, unique to the Firebase project. Do NOT use
    // // this value to authenticate with your backend server, if
    // // you have one. Use User.getToken() instead.
    // const uid = user.uid;
    // }
    // console.log("USER");
    // console.log(user);

    constructor(props){
        super(props);

        this.state = {
            picture: false,
            src: false
        }
    }

    handlePictureSelected(event) {
        var picture = event.target.files[0];
        var src     = URL.createObjectURL(picture);

        console.log(picture);
      
        this.setState({
          picture: picture,
          src: src
        });
    }

    render() {
        return (
            <div className="profile-header">
                <div className="image-container">
                  <text className="text">Upload Profile Image</text>
                  <input type="file" onChange={this.handlePictureSelected.bind(this)}/>
                </div>
            </div>
          )
    }
}

// export default AddProfilePicture;