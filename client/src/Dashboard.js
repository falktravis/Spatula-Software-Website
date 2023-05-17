import React from 'react';
//import {createClient} from '@supabase/supabase-js';

/*const supabase = createClient(
    process.env.SUPABASEURL,
    process.env.SUPABASEPUBLICANONKEY
)*/

export default function Dashboard() {
  return (
    <div className="dashboard">
        <div className='dashboardDisplay'>
            <div className='userDisplay'>
                <img id='userPicture' />
                <p className='username'>Username</p>
                <p className='tier'>Basic Subscription</p>
            </div>
            <button id='changePlan'>Change Plan</button>
        </div>
    </div>
  )
}
