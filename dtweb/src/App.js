import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
} from "react-router-dom";

import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import HostPage from './pages/HostPage';
import LogoutPage from './pages/LogoutPage';

import './App.css';
import io from 'socket.io-client';

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

  return (
    <BrowserRouter>
      <Route exact path="/">
        <HomePage 
          user={user}
          mainSocket={mainSocket}
          socketError={socketError}
        />
      </Route>
      <Route exact path="/game">
        <GamePage 
          user={user}
          mainSocket={mainSocket}
          socketError={socketError}
          timeRemain={timeRemain}
          isRunning={isRunning}
          lastBuzz={lastBuzz}
          buzzerDisabled={buzzerDisabled}
          scores={scores}
        />
      </Route>
      <Route exact path="/host">
        <HostPage user/>
      </Route>
      <Route exact path="/logout">
        <LogoutPage user/>
      </Route>
    </BrowserRouter>
  );
}

export default App;
