import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";
import './GuessInput.css';

function GuessInput({allSolutions, foundSolutions, correctAnswerCallback}) {

  const [labelText, setLabelText] = useState("Make your first guess!");
  const [userInput, setUserInput] = useState("");

  function userInputCheck() {
    if (foundSolutions.includes(userInput)) {
      setLabelText(userInput + " has already been found!");
    } else if (allSolutions.includes(userInput)) {
      correctAnswerCallback(userInput);
      setLabelText(userInput + " is correct!");
    } else {
      setLabelText(userInput + " is incorrect!");
    }
  }

  function keyPress(e) {
    if (e.key === 'Enter') {
      e.target.value = "";
      userInputCheck()
    }
  }

  return (
    <div className="Guess-input">
      <div>
        {labelText}
      </div>
      <TextField onKeyPress={(e) => keyPress(e)} onChange={(event) => setUserInput(event.target.value)} />
    </div>
  );
}

export default GuessInput;