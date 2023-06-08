import React, {useState, useEffect} from 'react';
import checkIcon from './imgs/checkIcon.svg';
import closeIcon from './imgs/close.svg';
import './styles/dashboard.scss';

export default function Dashboard() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log(userData);
    const [userSubscription, setUserSubscription] = useState('None');
    const [isPopup, setIsPopup] = useState(false);

    useEffect(() => {
        setIsPopup(false);

        async function getUserData(){
            try{
                const response = await fetch(`/user-data?userId=${userData.provider_id}`);
                const data = await response.json();
                console.log(data);
    
                if(data != null){
                    if(data.ConcurrentTasks == 5){
                        setUserSubscription("Basic");
                    }else if(data.ConcurrentTasks == 10){
                        setUserSubscription("Standard");
                    }else if(data.ConcurrentTasks == 20){
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

        if(userSubscription == "None"){
            return(
                <div className="userButtons">
                    <button className='logOut' onClick={() => logOut()}>Log Out</button>
                    <button href="https://billing.stripe.com/p/login/test_3cscQq8bs6Gn5dS3cc">Manage Plan</button>
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

            const response = await fetch(`/create-checkout-session?${queryParams}`, {
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
        window.location.href = 'http://localhost:3301';
    }

    return (
        <div className="dashboard">
            <div className="NavBar">
                <h1><a href='/'>Spatula Software</a></h1>
                <ul>
                    <li>Pricing</li>
                    <li><a >Dashboard</a></li>
                </ul>
            </div>
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
                                <a onClick={() => createCheckoutSession('price_1NB6BmK2JasPd9Yue4YiQAhH')}>Free Trial</a>
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
                                <a onClick={() => createCheckoutSession('price_1NBnrWK2JasPd9Yu8FEcTFDx')}>Subscribe</a>
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
                                <a onClick={() => createCheckoutSession('price_1NBnrrK2JasPd9YubBtmYjFJ')}>Subscribe</a>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsPopup(false)}><img src={closeIcon} /></button>
                </div>
            )}
        </div>
    )
}
