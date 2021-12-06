import React from 'react';
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button"; 
import { auth } from './firebase';
import './ProfilePage.css';
import avatar from './profile.png';

const ProfilePage = () => {
  return (
      <div className="user-profile">
      <div className="header">
          <h1>Profile</h1>
          <img alt="avatar" src={auth.currentUser.photoURL ? auth.currentUser.photoURL : avatar} />
      </div>
       <p>Name: {auth.currentUser.displayName}</p>
       <p>Email: {auth.currentUser.email}</p>
       <Button variant="outlined" onClick={() => auth.signOut()}>Sign out</Button>
       <p><Link to="/">Home</Link></p>
      </div>
  );
}

export default ProfilePage;