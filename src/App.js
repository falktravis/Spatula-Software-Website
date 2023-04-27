import React from 'react';
import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASEURL,
    process.env.SUPABASEPUBLICANONKEY
)

function App(){
    return (
        <div className='App'>

        </div>
    );
}
 export default App;