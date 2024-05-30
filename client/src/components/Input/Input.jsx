import React from 'react'
import { IoMdSend } from "react-icons/io";
import { FiLoader } from "react-icons/fi";

import "./Input.css";

const Input = ({query, currentChat, user, loading, setloading}) => {

  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default action
      query(e.target.value);
      e.target.value = "";
    } 
  }

  return (
    <div className='input'>
        <input placeholder="Enter your query" onKeyDown={onEnterPress} />

        <div className='send-icon' >
          { loading ? <FiLoader /> : <IoMdSend /> }
        </div>
    </div>
  )
}

export default Input