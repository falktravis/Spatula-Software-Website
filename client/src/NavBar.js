import React from "react";
import './styles/NavBar.scss';

const NavBar = () => {
    return(
        <div className="NavBar">
            <a href="/"><h1>Spatula Software</h1></a>
            <div className="navButtons">
                <ul>
                    <li><a href="/Pricing">Pricing</a></li>
                    <li><a href="https://discord.com/api/oauth2/authorize?client_id=1078415542404251790&redirect_uri=http%3A%2F%2Flocalhost%3A3008%2FDashboard&response_type=code&scope=identify">Login/Sign up</a></li>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;