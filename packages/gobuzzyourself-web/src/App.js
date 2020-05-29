import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
} from "react-router-dom";

import Sound from 'react-sound';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ScorePage from './pages/ScorePage';
import HostPage from './pages/HostPage';
import LogoutPage from './pages/LogoutPage';
import useInterval from './useInterval';

import './App.css';
import io from 'socket.io-client';

// Font not-so-awesome library bs
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPlusCircle, 
  faMinusCircle,
  faPause,
  faPlay,
  faTrash,
  faHistory,
  faPlusSquare,
  faMinusSquare,
  faCircle,
  faSquare,
  faStop
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faPlusCircle, 
  faMinusCircle,
  faPlusSquare,
  faMinusSquare,
  faPause,
  faPlay,
  faTrash,
  faHistory,
  faCircle,
  faSquare,
  faStop
);
// API server
const ENDPOINT=process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : "http://localhost:8090";

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
  const [socketWatchdog, setSocketWatchdog] = useState(0);
  const [isBuzzing, setIsBuzzing] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  // in this simple app the top-level App class will manage state and 
  // pass the socket down to children for communications with the server
  // our entire API is over socket.io, we have nothing more.
  useInterval(() =>{
    setSocketWatchdog(socketWatchdog + 1);
    
    if (socketWatchdog > 3) {
      console.log('no heartbeat!!')
      setSocketError('No heartbeat from server. Please wait a bit and try again, or reload the page.');
    }
  },1000);

  // These functions stop our sounds
  const handleBuzzDone =  () => {
    setIsBuzzing(false);
  };
  const handleTimeoutDone = () => {
    setIsTimeout(false);
  };

  useEffect(function setupSocket() { 

    if (! mainSocket) {
      console.log('socketsetup');

      const s = io(ENDPOINT);
      setMainSocket(s);

      // handle socket ops here and update game state
      s.on('connect', () => {
        console.log('connected');
        s.emit('getscores');
        setSocketError(null);
      });

      s.on('ping', (echo) => {
        s.emit('pong', echo);
      });

      s.on('tick', (data) => {
        setTimeRemain(data.timeRemain);
        setIsRunning(data.clockRunning);
        setSocketWatchdog(0); // all good, we're hearing heartbeats.
        setSocketError(null);
      });

      s.on('timesup', (data) => {
        console.log('timesup');
        setIsTimeout(true);
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
        console.log(data);
        if (data !== null) {
          setIsBuzzing(true);
          setLastBuzz(data);
        } else {
          setIsBuzzing(false);
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

  // handle sounds
  let buzzSound = null;
  if (isBuzzing) {
    buzzSound = (<Sound
     url="sounds/buzz.mp3"
     playStatus={Sound.status.PLAYING}
     onFinishedPlaying={handleBuzzDone}
     autoLoad={true}
     ignoreMobileRestrictions={true}
    />);
  }

  let timeoutSound = null;
  if (isTimeout) {
    buzzSound = (<Sound
     url="sounds/timeup.mp3"
     playStatus={Sound.status.PLAYING}
     onFinishedPlaying={handleTimeoutDone}
     autoLoad={true}
     ignoreMobileRestrictions={true}
    />);
  }

  return (
    <BrowserRouter>
      {buzzSound}{timeoutSound}
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
        <HostPage  
          user={user}
          mainSocket={mainSocket}
          socketError={socketError}
          timeRemain={timeRemain}
          isRunning={isRunning}
          lastBuzz={lastBuzz}
          buzzerDisabled={buzzerDisabled}
          scores={scores}/>
      </Route>
      <Route exact path="/scores">
        <ScorePage  
          user={user}
          mainSocket={mainSocket}
          socketError={socketError}
          timeRemain={timeRemain}
          isRunning={isRunning}
          lastBuzz={lastBuzz}
          buzzerDisabled={buzzerDisabled}
          scores={scores}/>
      </Route>
      <Route exact path="/logout">
        <LogoutPage user/>
      </Route>
    </BrowserRouter>
  );
}

export default App;
