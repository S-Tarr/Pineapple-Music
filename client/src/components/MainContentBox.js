import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom';

const MainContentBox = (props) => {
   const auth = useAuth();
   const history = useHistory();

   // useEffect(() => {
   //    window.alert(auth.currentUser)
   //  });

   return (
      <div>
         {auth.currentUser ? (
            <div>
               {props.children} 
            </div>
            ) : (
               history.push("/login")
            )
         }
      </div>     
   )
}

export default MainContentBox


