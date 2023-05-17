import React, {useRef} from 'react';
import Typewriter from 'typewriter-effect';
import './styles/hero.scss';

export default function Hero() {
    const pricing = useRef();
    
    const pricingScroll = () => {
        pricing.current?.scrollIntoView({behavior: 'smooth'});
    }

    return (
        <div className="heroPage">
            <div className="NavBar">
                <h1>Spatula Software</h1>
                <ul>
                    <li onClick={pricingScroll}>Pricing</li>
                    <li><a href="">Dashboard</a></li>
                </ul>
            </div>
            <div className="hero">
                <div className="heroContent">
                    <h2>Random Thing<Typewriter
                            options={{
                                strings: ['Hello', 'World'],
                                autoStart: true,
                                loop: true,
                            }}
                        />
                    </h2>
                    <p></p>
                    <button></button>
                </div>
            </div>
            <div ref={pricing} className='Pricing'>
                <div className='pricingCards'>
                    <div className='basic'>
                        <p>25</p>
                    </div>
                    <div className='standard'>
                        <p>35</p>
                    </div>
                    <div className='premium'>
                        <p>50</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
