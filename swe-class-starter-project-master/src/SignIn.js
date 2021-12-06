import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from './firebase';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import './SignIn.css';

const SignIn = ({signInSet}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState(null);
  const userSignInErrorMessage = "We encountered an error while trying to sign you in.";
  
   const signUserIn = () => {
    setSignInError(null);
    if (!email  || !password) {return;}
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        let displayMessage = userSignInErrorMessage;
        if(errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
             displayMessage = "Incorrect Username/Password";
        }
        else if(errorCode === "auth/invalid-email") {
            displayMessage = "Your email info is invalid";
        }
        setSignInError(displayMessage);
    });
  }
   
  const doGoogleSignIn = () => {
      setSignInError(null);
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
      .catch((error) => {
        console.error(error);
        setSignInError(userSignInErrorMessage);
      });
  }
    
  return (
      <div className="background">
      <div>
          <p><Link to="/">Boggle Home</Link></p>
          <div className="user-login">
              <div className="header">Hello again!</div>
              {signInError ? <div className="user-error">{signInError}</div> : <></>}
              <TextField label="Email address" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button variant="outlined" onClick={signUserIn}>Sign in</Button>
          </div>
          <div className="outer-button">
              <Button variant="outlined" onClick={doGoogleSignIn}>Sign In with Google account</Button>
              <Button variant="outlined" onClick={() => {signInSet(false);}}>Sign up</Button>
          </div>
    </div>
    </div>
  );
}

export default SignIn;