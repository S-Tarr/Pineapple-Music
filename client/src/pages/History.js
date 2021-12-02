import React from 'react';
import app from "../firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, updateDoc, getDocs, doc } from "firebase/firestore";

function History({ }) {
    return <div className="Page">
                <h1>History</h1>
                <h2 font-size=".5rem" just ify-content="center">
                The history will appear here in the future!
                </h2>
            </div>
}

export default History;