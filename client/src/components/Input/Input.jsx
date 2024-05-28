import React from 'react'

import "./Input.css";

const Input = ({query}) => {

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
    </div>
  )
}

export default Input