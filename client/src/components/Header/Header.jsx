import React from 'react'
import { FaRobot } from "react-icons/fa6";

import './style.css';
import { signOutUser } from '../../js/auth';
import SignIn from '../SignIn/SignIn';
import SignOut from '../SignOut/SignOut';

const Header = ({user}) => {
  return (
    <div className="header">
      <FaRobot />

      {user && 
        <SignOut />
      }
    </div>
  )
}

export default Header