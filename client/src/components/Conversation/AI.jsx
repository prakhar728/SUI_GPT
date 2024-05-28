import React from 'react';
import { FaRobot } from "react-icons/fa";

import "./style.css";

const AI = ({data}) => {
  if (!(data instanceof Array))
    data = [data]
  
  return (
    // eslint-disable-next-line react-dom/validate-dom-nesting
    <div className='ai'>
        <FaRobot />
        {data.map((element, index) => (
          <div key={index} >{element}</div>
      ))}
    </div>
  )
}

export default AI