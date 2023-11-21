import React from 'react';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from './Hero.js';
import Dashboard from './Dashboard.js'
import Success from './Success.js';
import Footer from './Footer.js';
import './styles/main.scss';

function App(){
    return (
        <Router>
            <div className='App'>
                <Routes>
                    <Route exact path='/' element={<Hero />} />
                    <Route exact path='/Dashboard' element={<Dashboard />} />
                    <Route exact path='/Success' element={<Success />} />
                </Routes>
            </div>
            <Footer/>
        </Router>
    );
}

export default App;