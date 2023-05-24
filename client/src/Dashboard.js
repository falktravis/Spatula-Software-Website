import React from 'react';
import './styles/dashboard.scss';

export default function Dashboard() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log(userData);

    const handleCheckout = async (priceId) => {
        const response = await fetch('/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: priceId, // Use the specific price ID from your product in the Stripe Dashboard
          }),
        });
    
        const { sessionId } = await response.json();
        // Redirect the user to the Checkout page using the session ID
        stripe.redirectToCheckout({ sessionId });
    };

    //return 

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
                        <p className='tier'>Subscription Tier: <span>Basic</span></p>
                    </div>
                </div>
                <form className="userButtons" method="POST" action="/create-customer-portal-session">
                    <button type="submit">Manage Plan</button>
                    <button onClick={() => handleCheckout('priceIdExample')}>Basic</button>
                </form>
            </div>
        </div>
    )
}
