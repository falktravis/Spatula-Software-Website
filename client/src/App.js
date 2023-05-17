import React from 'react';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from './Hero.js';
import Dashboard from './Dashboard.js'
import './styles/main.scss';

function App(){
    return (
        <Router>
            <div className='App'>
                <Routes>
                    <Route exact path='/' element={<Hero />} />
                    <Route exact path='/Dashboard' element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;