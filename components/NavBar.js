import React from 'react';
import { Link } from 'gatsby';
import '../styles/NavBar.scss';

export default function NavBar() {
  return (
    <nav className='NavBar'>
        <Link to="/"><h1>Spatula Software</h1></Link>
        <div className="navButtons">
          <ul>
              <li><Link to='/Pricing'>Pricing</Link></li>
              <li><Link to='/FAQ'>FAQ</Link></li>
              <li><Link to='/About'>About</Link></li>
              <li><Link to='/Contact'>Contact</Link></li>
          </ul>
        </div>
    </nav>
  )
}