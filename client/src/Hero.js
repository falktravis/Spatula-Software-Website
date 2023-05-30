import React, {useRef, useEffect} from 'react';
import Typed from 'react-typed';
import { useNavigate } from "react-router-dom"
import {createClient} from '@supabase/supabase-js';
import checkIcon from './imgs/checkIcon.svg';
import heroImg from './imgs/heroImg.png';
import notification1 from './imgs/Notification1.png';
import notification3 from './imgs/Notification3.png';
import notification4 from './imgs/Notification4.png';
import wavesImg1 from './imgs/waves1.svg';
import wavesImg2 from './imgs/waves2.svg';
import './styles/hero.scss';

export default function Hero() {
    const pricing = useRef();
    const navigate = useNavigate();
    const supabase = createClient(
        process.env.SUPABASEURL,
        process.env.SUPABASEPUBLICANONKEY
    )

    useEffect(() => {
        setSession();
        //console.log(JSON.parse(localStorage.getItem('userData')));
    }, [])
    
    const setSession = async () => {
        if(localStorage.getItem('userData') == null){
            const session = await supabase.auth.getSession();
            if(session != null){
                localStorage.setItem("userData", JSON.stringify(session.data.session.user.user_metadata));
                navigate('/Dashboard');
            }
        }
    }
    
    const pricingScroll = () => {
        pricing.current?.scrollIntoView({behavior: 'smooth'});
    }

    const handleDashboardClick = async () => {
        if(localStorage.getItem('userData') == null){
            await supabase.auth.signInWithOAuth({
                provider: "discord"
            })
        }else{
            navigate('/Dashboard');
        }
    }

    //                <img src={heroImg} alt="Collage of post notifications" className='notifications' />
    return (
        <div className="heroPage">
            <div className="NavBar">
                <h1>Spatula Software</h1>
                <ul>
                    <li onClick={pricingScroll}>Pricing</li>
                    <li><a onClick={handleDashboardClick}>Dashboard</a></li>
                </ul>
            </div>
            <div className="hero">
                <div className="heroContent">
                    <h2>The Only Professional Tool For <Typed
                        strings={['Flippers', 'Facebook Marketplace', 'Ebay']}
                            typeSpeed={60}
                            backSpeed={60}
                            backDelay={2000}
                            loop >
                        </Typed>
                    </h2>
                    <p>Up to 10x faster than competitors with automatic messaging for Facebook Marketplace.</p>
                    <a onClick={handleDashboardClick}><span>Free Trial</span></a>
                </div>

                <img src={wavesImg1} alt="Wave Image" className='waves1' />
            </div>
            <div className="landingPageContent">
                <div className="row1">
                    <p>Use Discord commands to create tasks from anywhere that will run simultaneously and notify you about posts.</p>
                    <div className="softwareBenefits">
                        <img src={notification3} alt="Screenshot of notification" />
                        <h4>Get notifications on your phone and computer, less than 5 minutes after they are listed.</h4>
                    </div>
                </div>
                <div className="row2">
                    <div className="softwareMessaging">
                        <div className="imgContainer">
                            <img className="img1" src={notification1} alt="Screenshot of notification with message button" />
                            <img src={notification4} alt="Screenshot of notification with message sent" />
                        </div>
                        <h4>Automatically message Facebook users about their post, or message with just a single click.</h4>
                    </div>
                    <p>Effectively automate the flipping process</p>
                </div>
            </div>
            <img src={wavesImg2} alt="Wave Image" className='waves2' />
            <div ref={pricing} className='Pricing'>
                <div className='pricingCards'>
                    <div className='basic'>
                        <div className="pricingModel">
                            <p>Basic</p>
                        </div>
                        <div className="modelPrice">
                            <p>$30/<span>mo</span></p>
                        </div>
                        <div className="modelContent">
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>5 Concurrent Tasks</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Ebay Notifications</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Marketplace Notifications</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook One-Click Messaging</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Auto Messaging</p>
                            </div>
                        </div>
                        <div className="modelButton">
                            <button onClick={handleDashboardClick}>Free Trial</button>
                        </div>
                    </div>
                    <div className='standard'>
                        <div className="pricingModel">
                            <p>Standard</p>
                        </div>
                        <div className="modelPrice">
                            <p>$40/<span>mo</span></p>
                        </div>
                        <div className="modelContent">
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>10 Concurrent Tasks</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Ebay Notifications</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Marketplace Notifications</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook One-Click Messaging</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Auto Messaging</p>
                            </div>
                        </div>
                        <div className="modelButton">
                            <button onClick={handleDashboardClick}>Subscribe</button>
                        </div>
                    </div>
                    <div className='premium'>
                        <div className="pricingModel">
                            <p>Premium</p>
                        </div>
                        <div className="modelPrice">
                            <p>$50/<span>mo</span></p>
                        </div>
                        <div className="modelContent">
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>20 Concurrent Tasks</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Ebay Notifications</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Marketplace Notifications</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook One-Click Messaging</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Auto Messaging</p>
                            </div>
                        </div>
                        <div className="modelButton">
                            <button onClick={handleDashboardClick}>Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
