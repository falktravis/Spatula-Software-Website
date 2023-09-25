import React, {useState, useRef, useEffect} from 'react';
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
import commandsImg from './imgs/Commands.png';
import './styles/hero.scss';

export default function Hero() {
    const pricing = useRef();

    //landing page content function displays
    const tasksContent = () => {

        return(
            <div className="landingContentDisplay">
                <div className="tasks">
                    <h4>Use Discord commands to create tasks from anywhere that will notify you about Facebook Marketplace posts, each task will monitor a different product.</h4>
                    <img src={commandsImg} alt="Commands Image" />
                </div>
            </div>
        );
    }

    const notificationContent = () => {

        return(
            <div className="landingContentDisplay">
                <div className="notifications">
                    <img src={notification3} alt="Screenshot of notification" />
                    <div className="textContent">
                        <h4>Get notifications on your phone and computer, when an item is listed.</h4>
                        <p>Notifications will display all the info about the item including, title, price, location, and description</p>
                    </div>
                </div>
            </div>
        );
    }

    const messagingContent = () => {

        return(
            <div className="landingContentDisplay">
                <div className="messaging">
                    <div className="imgContainer">
                        <img className="img1" src={notification1} alt="Screenshot of notification with message button" />
                        <img src={notification4} alt="Screenshot of notification with message sent" />
                    </div>
                    <h4>Automatically message Facebook users about their post, or message with just a single click.</h4>
                </div>
            </div>
        );
    }

    const [landingContentDisplay, setLandingContentDisplay] = useState(tasksContent);
    const [tasksContentClass, setTasksContentClass] = useState('active');
    const [notificationsContentClass, setNotificationsContentClass] = useState('');
    const [messagingContentClass, setMessagingContentClass] = useState('');
    const navigate = useNavigate();
    const supabase = createClient(
        process.env.SUPABASEURL,
        process.env.SUPABASEPUBLICANONKEY
    );

    useEffect(() => {
        setSession();
        //console.log(JSON.parse(localStorage.getItem('userData')));
    }, [])
    
    const setSession = async () => {
        if(localStorage.getItem('userData') == null && window.location.search.includes('login')){
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
                provider: "discord", 
                options: { 
                  redirectTo: 'https://spatulasoftware.com/?login' 
                } 
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
                        strings={['Flippers', 'Facebook Marketplace', 'Making Money']}
                            typeSpeed={60}
                            backSpeed={60}
                            backDelay={2000}
                            loop >
                        </Typed>
                    </h2>
                    <p>Get notifications about new posts and automatically message the owner.</p>
                    <a id='trial' onClick={handleDashboardClick}><span>Free Trial</span></a>
                </div>
                <img src={heroImg} alt="Iphone and Computer Software Example" className='heroImg' />
                <img src={wavesImg1} alt="Wave Image" className='waves1' />
                <div className="discord1">
                    <p>Join the discord to see how the service works, and how our members are making huge profits flipping items!</p>
                    <a href='https://discord.gg/8e6vGhfbR7' target='_blank'>Discord Access</a>
                </div>
                <div className="discord2">
                    <p>Want to see how the service works and how our members make huge profits?</p>
                    <a href='https://discord.gg/8e6vGhfbR7' target='_blank'>Join the Discord</a>
                </div>
            </div>
            <div className="landingPageContent">
                <h2>How Does it Work?</h2>
                <div className="contentButtons">
                    <button className={tasksContentClass} onClick={() => {setLandingContentDisplay(tasksContent); setTasksContentClass('active'); setNotificationsContentClass(''); setMessagingContentClass('');}}>1. Tasks</button>
                    <button className={notificationsContentClass} onClick={() => {setLandingContentDisplay(notificationContent); setTasksContentClass(''); setNotificationsContentClass('active'); setMessagingContentClass('');}}>2. Notifications</button>
                    <button className={messagingContentClass} onClick={() => {setLandingContentDisplay(messagingContent); setTasksContentClass(''); setNotificationsContentClass(''); setMessagingContentClass('active');}}>3. Messaging</button>
                </div>
                {landingContentDisplay}
            </div>
            <img src={wavesImg2} alt="Wave Image" className='waves2' />
            <div ref={pricing} className='Pricing'>
                <div className='pricingCards'>
                    <div className='basic'>
                        <div className="pricingModel">
                            <p>Basic</p>
                        </div>
                        <div className="modelPrice">
                            <p>$35/<span>mo</span></p>
                        </div>
                        <div className="modelContent">
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>2 Concurrent Tasks</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Notifications</p>
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
                            <p>$45/<span>mo</span></p>
                        </div>
                        <div className="modelContent">
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>5 Concurrent Tasks</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Notifications</p>
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
                            <p>$55/<span>mo</span></p>
                        </div>
                        <div className="modelContent">
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>10 Concurrent Tasks</p>
                            </div>
                            <div className="modelAspect">
                                <img src={checkIcon} alt="check" />
                                <p>Facebook Notifications</p>
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
