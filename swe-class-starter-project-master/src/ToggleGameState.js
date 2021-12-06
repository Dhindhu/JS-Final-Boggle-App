import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import {GAME_STATE} from './GameState.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { auth } from './firebase';
import './ToggleGameState.css';
import { collection, addDoc, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from './firebase.js';

function ToggleGameState({gameState, setGameState, setSize, setTotalTime, numFound, userGrid, setUserGrid}) {

  const [buttonText, setButtonText] = useState("Start a new game!");
  const [userInput, setUserInput] = useState("");
  const [changeTime, setChangeTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [boardSize, setBoardSize] = useState(3);
  const [leaderBoard, setLeaderBoard] = useState([]);
  

  auth.onAuthStateChanged((user) => {
     if (user) {
         setUserInput(user.displayName);
     }
  }); 
  let d = 0;
  
  function updateGameState(endTime) {
    
    if (gameState === GAME_STATE.SHOW_LEADERBOARD || gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) {
      setStartTime(Date.now());
      setGameState(GAME_STATE.IN_PROGRESS);
      setButtonText("End game");
    } else if (gameState === GAME_STATE.IN_PROGRESS) {
      d = (endTime - startTime)/ 1000.0;
      setChangeTime(d);
      setTotalTime(d); 
      setGameState(GAME_STATE.ADD_LEADERBOARD);
    }
  }
  
  async function printScoreBoard(){
   
      setGameState(GAME_STATE.SHOW_LEADERBOARD);
      setButtonText("Continue");
 
    try {
       const giveQuery = query(collection(db, "Leaderboard"), orderBy("numFound", "desc"), limit(7));
       const queryResult = await getDocs(giveQuery);
       const restrtGame = queryResult.docs.map((doc) => {
       console.log(doc.id, " => ", doc.data());
       return doc.data(); 
      });
        
      setLeaderBoard([...restrtGame, ...leaderBoard]);
      console.log("User leaderboard = ", leaderBoard);
    } catch (e) {
      console.error("An error occured with the document: ", e);
    }
    
  }


  async function AddResult() {
    try {
      await addDoc(collection(db, "Leaderboard"), {
      boardSize: boardSize,
      solveTime: changeTime,
      numFound: numFound,    
      theBoard: userGrid,
      playerName: userInput
      });  
    } catch (e) {
      console.error("An error occured with the document: ", e);
    }
  }

  function userInputCheck() {
    setGameState(GAME_STATE.ENDED);
    setButtonText("Start a new game!");
    AddResult();
  }

  function keyPress(e) {
    if (e.key === 'Enter') {
      e.target.value = "";
      userInputCheck();
    }
  }

  const gridSupervisor = (event) => {
    setUserGrid(JSON.parse(event.target.value));
    setSize(-11111);
    console.log("userGrid = ", event.target.value); 
  };

  const homePagesupervisor = (event) => {
    setBoardSize(event.target.value);
    setSize(event.target.value);
  };
  
  
  
  return (
    <div>
    { (gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED) &&
    <div className="Another-toggle-game-state">
          <Button variant="outlined" onClick={() => printScoreBoard()} >
            Continue
          </Button>
    </div>
    }
    <div className="Toggle-game-state">
      { gameState === GAME_STATE.ADD_LEADERBOARD &&
        <TextField value={userInput} id="outlined-basic" label="Enter Your Name" variant="outlined" onKeyPress={(e) => keyPress(e)} onChange={(event) => setUserInput(event.target.value)} />
      }
      { gameState !== GAME_STATE.ADD_LEADERBOARD &&
         <Button variant="outlined" onClick={() => updateGameState(Date.now())} >
        {buttonText}
        </Button>
      }

      { (gameState === GAME_STATE.BEFORE || gameState === GAME_STATE.ENDED)  &&
        <div className="Input-select-size">
        <FormControl>
       
        <Select
          labelId="sizelabel"
          id="sizemenu"
          value={boardSize}
          onChange={homePagesupervisor}
        >
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
         <FormHelperText>Set Grid Size</FormHelperText>
        </FormControl>
       </div>
      }

      {(gameState === GAME_STATE.SHOW_LEADERBOARD) &&
        <div className="Input-select-size">
        <FormControl>
          
       <Select
         labelId="lblabel"
         id="lbmenu"
         value=''
         onChange={gridSupervisor}
       >
       {leaderBoard.map((item, idx) => {
        return (
            <MenuItem key={idx} value={item.theBoard}>
              Board size: {item.boardSize} Total words you found: {item.numFound} Your name: {item.playerName}
            </MenuItem>
        );
       })}
       </Select>
       <FormHelperText>Select past Game</FormHelperText>
        </FormControl>
        </div>
      }
      
    </div>
</div>
  );
}

export default ToggleGameState;
