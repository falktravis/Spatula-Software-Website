import React, {useState, useEffect} from 'react';
import checkIcon from './imgs/checkIcon.svg';
import closeIcon from './imgs/close.svg';
import './styles/dashboard.scss';

export default function Dashboard() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [userSubscription, setUserSubscription] = useState('None');
    const [isPopup, setIsPopup] = useState(false);

    useEffect(() => {
        setIsPopup(false);

        async function getUserData(){
            try{
                const response = await fetch(`/server/user-data?userId=${userData.provider_id}`);
                const data = await response.json();
    
                if(data != null){
                    if(data.ConcurrentTasks == 2){
                        setUserSubscription("Basic");
                    }else if(data.ConcurrentTasks == 5){
                        setUserSubscription("Standard");
                    }else if(data.ConcurrentTasks == 10){
                        setUserSubscription("Premium");
                    }
                }
            } catch (error) {
                // Handle error
                console.error(error);
            }
        }
        getUserData();
    }, [])

    const actionButton = () => {
        console.log(userSubscription);
        if(userSubscription != "None"){ //https://billing.stripe.com/p/login/test_3cscQq8bs6Gn5dS3cc
            return(
                <div className="userButtons">
                    <button className='logOut' onClick={() => logOut()}>Log Out</button>
                    <button onClick={() => window.open("https://billing.stripe.com/p/login/8wMeVW3Bo6OlewU5kk")}>Manage Plan</button>
                </div>
            );
        }else{
            return(
                <div className="userButtons">
                    <button className='logOut' onClick={() => logOut()}>Log Out</button>
                    <button onClick={() => setIsPopup(true)}>Purchase</button>
                </div>
            );
        }
    }

    const createCheckoutSession = async (priceId) => {
        try {
            const queryParams = new URLSearchParams({
                discordId: userData.provider_id,
                priceId: priceId,
            });

            const response = await fetch(`/server/create-checkout-session?${queryParams}`, {
                method: 'POST',
            });
            const { url } = await response.json();
            window.location.href = url; // Redirect to the Checkout URL
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const logOut = () => {
        localStorage.removeItem('userData');

        window.location.href = 'https://spatulasoftware.com/';
    }

    /**
     * Basic - price_1NB6BmK2JasPd9Yue4YiQAhH
     * Standard - price_1NBnrWK2JasPd9Yu8FEcTFDx
     * Premium - price_1NBnrrK2JasPd9YubBtmYjFJ
     */

    return (
        <div className="dashboard">
            <nav className="NavBar">
                <h1><a href='/'>Spatula Software</a></h1>
                <ul>
                    <li><a href="/">Pricing</a></li>
                    <li><a href='/Dashboard'>Dashboard</a></li>
                </ul>
            </nav>
            <div className='dashboardDisplay'>
                <div className='userDisplay'>
                    <img id='userPicture' src={userData.avatar_url} />
                    <div className="userInfo">
                        <p className='username'>Username: {userData.name}</p>
                        <p className='tier'>Subscription Tier: <span>{userSubscription}</span></p>
                    </div>
                </div>
                {actionButton()}
            </div>
            {isPopup && (
                <div className="popup">
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
                                <a onClick={() => createCheckoutSession('price_1NjNhZK2JasPd9Yuf9mGP9Nm')}>Free Trial</a>
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
                                <a onClick={() => createCheckoutSession('price_1NjNiMK2JasPd9Yu8sGt7zWM')}>Subscribe</a>
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
                                <a onClick={() => createCheckoutSession('price_1NjNjDK2JasPd9YusTMvOEJ5')}>Subscribe</a>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsPopup(false)}><img src={closeIcon} /></button>
                </div>
            )}
        </div>
    )
}
