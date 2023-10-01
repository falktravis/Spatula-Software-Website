import React from 'react';
import CheckIcon from './imgs/circleCheck.svg';
import './styles/success.scss';

function Success() {
  return (
    <div className='success'>
        <nav className="NavBar">
            <h1><a href='/'>Spatula Software</a></h1>
            <ul>
                <li><a href="/">Pricing</a></li>
                <li><a href='/Dashboard'>Dashboard</a></li>
            </ul>
        </nav>
        <div className="successMsg">
            <img src={CheckIcon} alt="Check Icon" />
            <h2>Thank you for your purchase!</h2>
            <p>Join the discord below in order to access the bot, open a ticket in the discord if you are have any questions or problems.</p>
            <a href='https://discord.gg/8e6vGhfbR7' target='_blank'>Discord Access</a>
        </div>
    </div>
  )
}

export default Success;