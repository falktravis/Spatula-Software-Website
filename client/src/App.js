import React from 'react';
import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASEURL,
    process.env.SUPABASEPUBLICANONKEY
)

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
                <button>Anual</button>
                <div className='monthlyPricingCards'>
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
                <div className='anualPricingCards'>
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
    );
}
 export default App;