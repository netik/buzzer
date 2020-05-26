import React, { useState, useEffect } from "react";
import {
  BrowserRouter as BrowserRouter, 
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import io from 'socket.io-client';
import NavBar from "./NavBar";
import LoginBox from "./LoginBox";
import Buzzer from "./Buzzer";
import DTHeader from "./DTHeader";
import TimeClock from "./TimeClock";
import ScoreBoard from "./ScoreBoard";
import {
  Alert
} from "reactstrap";

const ENDPOINT="http://localhost:8090";

// set up our heartbeat
function App() {
  const [mainSocket, setMainSocket] = useState(null);
  const [socketError, setSocketError] = useState(null);
  const [timeRemain, setTimeRemain] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastBuzz, setLastBuzz] = useState(null);
  const [buzzerDisabled, setBuzzerDisabled] = useState(true);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState(null);
  const [socketTimer, setSocketTimer] = useState(null);
  const [socketWatchdog, setSocketWatchdog] = useState(0);

  // in this simple app the top-level App class will manage state and 
  // pass the socket down to children for communications with the server
  // our entire API is over socket.io, we have nothing more.
  useEffect(function setupWatchdogTimer() {
    function fireClientTick() { 
      const newVal = socketWatchdog + 1;
      setSocketWatchdog(newVal);

      if (newVal > 2) {
        setSocketError('No heartbeat from server. Please wait a bit and try again, or reload the page.');
      }
    }

    if (!socketTimer) {
      setSocketTimer(setInterval(fireClientTick, 1000));
    }
  }, [socketTimer,socketWatchdog]);

  useEffect(function setupSocket() { 
    if (! mainSocket) {
      console.log('socketsetup');

      const s = io(ENDPOINT);
      setMainSocket(s);

      // handle socket ops here and update game state
      s.on('connect', () => {
        console.log('connected');
        setSocketError(null);
      });

      s.on('tick', (data) => {
        setTimeRemain(data.timeRemain);
        setIsRunning(data.isRunning);
        setSocketWatchdog(0); // all good, we're hearing heartbeats.
      });

      s.on('joined', (data) => {
        console.log('join ok!');
        setUser(data);

        // ask the server for the current scores.
        s.emit('getscores');
      });

      s.on('scoreupdate', (data) => {
        console.log('scoreupdate');
        const myMap = new Map(JSON.parse(data));
        setScores(myMap);
      });

      s.on('lockout', (data) => {
        if (data) {
          setBuzzerDisabled(true);
        } else {
          setBuzzerDisabled(false);
        }
      });

      s.on('lastbuzz', (data) => {
        if (data !== null) {
          setLastBuzz(data);
        } else {
          setLastBuzz(null);
        }
      });

      // after all that, can we join?
      let prevUser;
      
      if (sessionStorage.getItem('user')) {
        prevUser = JSON.parse(sessionStorage.getItem('user'))
      }
      
      if (prevUser) {
        // TODO: Security goes here. 
        console.log('using prior login...');
        setUser(prevUser);
        // join and ask the server for the current scores.
        s.emit('join', { name: prevUser.name });

        s.emit('getscores');
      }
    }
  },[mainSocket, timeRemain, lastBuzz, buzzerDisabled, user]);

  // render -------------------------------------------------------
  let sockErrorComp = null;
  if (socketError != null) {
    sockErrorComp = (<Alert color="danger">{socketError}</Alert>);
  }

  if (user !== null) { 
    return (
      <div className="App">
        <NavBar socket={mainSocket} user={user}/>
          {sockErrorComp}
          <DTHeader/>
          <TimeClock 
            socket={mainSocket} 
            user={user} 
            isRunning={isRunning}
            timeRemain={timeRemain} 
            buzzerDisabled={buzzerDisabled}/>
          <Buzzer 
            socket={mainSocket} 
            user={user} 
            buzzerDisabled={buzzerDisabled}/>
          <ScoreBoard 
            socket={mainSocket} 
            user={user} 
            scores={scores} 
            buzzerDisabled={buzzerDisabled}/>
     </div>
    );
  }

  return (
    <div className="App">
      <NavBar user={user} />
      {sockErrorComp}
      <LoginBox socket={mainSocket} user={user}/>
    </div>
  );
}

export default App;
