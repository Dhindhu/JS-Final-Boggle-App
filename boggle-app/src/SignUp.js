import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from './firebase';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import './SignIn.css';

const SignUp = ({signInSet}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState(null);

    
  const userSignInErrorMessage = "We encountered an error while trying to sign you up.";
    
  const signUserUp = () => {
    setUserError(null);
    if (!email  || !password || !name) {return;}
    auth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
            result.user.updateProfile({
                displayName: name
            }).then(() => {
            }, (e) => {
                setUserError(userSignInErrorMessage);
                console.log(e)
        });     
        })
        .catch((e) => {
        let displayMessage = userSignInErrorMessage;
        if (e.code === 'auth/email-already-in-use'){
            displayMessage = "Your email info is already in our system";
        }
        setUserError(displayMessage);
        console.log(e)
    });
  }
  
  const userGoogleSignUp = () => {
      setUserError(null);
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
        setUserError(userSignInErrorMessage);
      });
  }
  
  return (
      <div className="background">
      <div>
          <p><Link to="/">Boggle Home</Link></p>
          <div className="user-login" onSubmit={(e) => {signUserUp(e)}}>
              <div className="header">Register</div>
              {userError ? <div className="user-error">{userError}</div> : <></>}
              <TextField label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
              <TextField label="Email address" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button variant="outlined" onClick={signUserUp}>Sign up</Button>
          </div>
          <div className="outer-button">
              <Button variant="outlined" onClick={userGoogleSignUp}>Sign up with Google account</Button>
              <Button variant="outlined" onClick={() => {signInSet(true);}}>I already have an account</Button>
          </div>
    </div>
    </div>
  );
}

export default SignUp;