import React, { useState } from 'react';
import { auth } from './firebase';
import ProfilePage from './ProfilePage';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Application = () => {
    const [userSignIn, signInSet] = useState(true);
    const [booglePlayer, setbooglePlayer] = useState();
    
    auth.onAuthStateChanged((player) => {
        setbooglePlayer(player);
    });
    
    return ( 
        <>
        {booglePlayer ? <ProfilePage /> : (userSignIn ? <SignIn signInSet={signInSet} /> : <SignUp signInSet={signInSet} />)}
        </>
    );
}

export default Application;