import React from 'react';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './LandingPage';
import Pricing from './Pricing';
import Dashboard from './Dashboard';
import NavBar from './NavBar';
import Footer from './Footer';

function App(){
    return (
        <Router>
            <div className='App'>
                <NavBar />
                <Routes>
                    <Route exact path='/' element={<LandingPage />} />
                    <Route exact path='/Pricing' element={<Pricing />} />
                    <Route exact path='/Dashboard' element={<Dashboard />} />
                </Routes>
                <Footer/>
            </div>
        </Router>
    );
}
 export default App;