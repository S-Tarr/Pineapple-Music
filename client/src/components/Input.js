import React from 'react'
import "./Input.css"

function Input({ type, placeholder }) {
   return (
      <div>
         <input className="input" placeholder={placeholder && placeholder} type="text"/>
      </div>
   )
}

export default Input
