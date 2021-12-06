import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase';
import findAllSolutions from './boggle_solver.js';
import Board from './Board.js';
import GuessInput from './GuessInput.js';
import FoundSolutions from './FoundSolutions.js';
import SummaryResults from './SummaryResults.js';
import ToggleGameState from './ToggleGameState.js';
import logo from './logo.png';
import './App.css';
import {GAME_STATE} from './GameState.js';
import {RandomGrid} from './randomGen.js';

function App() {

  const [allSolutions, setAllSolutions] = useState([]);
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE);
  const [grid, setUserGrid] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [size, setSize] = useState(3);
  const [bogglePlayer, setbogglePlayer] = useState();

  auth.onAuthStateChanged((player) => {
     setbogglePlayer(player);
  });
  
  // useEffect will trigger when the array items in the second argument are
  // updated so whenever grid is updated, we will recompute the solutions
  useEffect(() => {
    const wordList = require('./full-wordlist.json');
    let tmpAllSolutions = findAllSolutions(grid, wordList.words);
    setAllSolutions(tmpAllSolutions);
  }, [grid]);

  // This will run when gameState changes.
  // When a new game is started, generate a new random grid and reset solutions
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      if(size !== -11111)  // grid was not gotten from firestore
          setUserGrid(RandomGrid(size));
      setFoundSolutions([]);
    }
  }, [gameState, size]);

  function correctAnswerFound(answer) {
    console.log("New correct answer:" + answer);
    setFoundSolutions([...foundSolutions, answer]);
  }

  return (
    <div className="App">
        <div className="align-buttons">
          <img src={logo}  width="30%" height="30%"  alt="Bison Boggle Logo" />
           <Link to="/application">{bogglePlayer ? 'Profile' : 'Sign In'}</Link>
        </div>
        <ToggleGameState gameState={gameState}
                       setGameState={(state) => setGameState(state)}
                       setSize={(state) => setSize(state)}
                       setTotalTime={(state) => setTotalTime(state)}
                       numFound={foundSolutions.length}
                       userGrid={JSON.stringify(grid)}
                       setUserGrid={(state) => setUserGrid(state)}/>

      { gameState === GAME_STATE.IN_PROGRESS &&
        <div>
          <Board board={grid} />

          <GuessInput allSolutions={allSolutions}
                      foundSolutions={foundSolutions}
                      correctAnswerCallback={(answer) => correctAnswerFound(answer)}/>
          <FoundSolutions headerText="Solutions you've found" words={foundSolutions} />
        </div>
      }
      { gameState === GAME_STATE.ENDED &&
        <div>
          <Board board={grid} />
          <SummaryResults words={foundSolutions} totalTime={totalTime} />
          <FoundSolutions headerText="Missed Words [wordsize > 3]: " words={allSolutions}  />


        </div>
      }
    </div>
  );
}

export default App;
