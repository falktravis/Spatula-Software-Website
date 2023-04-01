import React from 'react';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './LandingPage';
import NavBar from './NavBar';

function App(){
    return (
        <Router>
            <div className='App'>
                <NavBar />
                <Routes>
                    <Route exact path='/' element={<LandingPage />} />
                </Routes>
            </div>
        </Router>
    );
}
 export default App;