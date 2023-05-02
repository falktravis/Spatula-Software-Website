import React, {useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASEURL,
    process.env.SUPABASEPUBLICANONKEY
)

const [isToggled, setIsToggled] = useState(false);
const toggle = () => {
    setIsToggled(!isToggled);

}

function App(){
    return (
        <div className='App'>
            <h1>Spatula Software</h1>
            <div className='dashboardDisplay'>
                <div className='userDisplay'>
                    <img id='userPicture' />
                    <p className='username'>Username</p>
                    <p className='tier'>Basic Subscription</p>
                </div>
                <button id='changePlan'>Change Plan</button>
            </div>
            <div className='Pricing'>
                <div className='pricingModelToggle'>
                    <label>
                        <input type="checkbox" defaultChecked={isToggled} onClick={toggle} />
                        <span />
                        <strong>{label}</strong>
                    </label>
                </div>
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
    );
}
 export default App;