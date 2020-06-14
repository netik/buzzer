import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BrowserRouter,
  Route,
} from "react-router-dom";

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import GamePage from './pages/GamePage';
import ScorePage from './pages/ScorePage';
import HostPage from './pages/HostPage';
import LogoutPage from './pages/LogoutPage';
import useInterval from './useInterval';

import soundTable from './soundTable';

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
  faVolumeUp,
  faCircle,
  faSquare,
  faStop
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faPlusCircle, 
  faMinusCircle,
  faPlusSquare,
  faMinusSquare,
  faVolumeUp,
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
  
  // eslint-disable-next-line no-unused-vars
  const audioObj = useRef(new Audio('sounds/sprite.mp3'));
  const [audioLocked, setAudioLocked] = useState(true);
  const soundEnd = useRef(0);

  // this implements end-of-sprite audio stopping
  audioObj.current.addEventListener('timeupdate', function(ev) {
    console.log(audioObj.current.currentTime);
    if (audioObj.current.currentTime > soundEnd.current) {
      audioObj.current.pause();
    }
  },false);

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

  // toggles the state in this component when NavBar button clicked
  const playSound = useCallback((sound)  => {
    if (audioLocked.current) { 
      console.log('ignoring play request because audio still locked'); 
      return;
    } // this will stop us from playing on devices that don't support it.

    // look up the sound in the sprite table
    audioObj.current.currentTime = soundTable.spritemap[sound].start;
    soundEnd.current = soundTable.spritemap[sound].end;
    audioObj.current.play();
  }, [audioLocked]);

  useEffect( () => {
    // this is a workaround for audio sand boxing.
    console.log('fires');
    if (!audioLocked) {
      try {
        audioObj.current.play();
        audioObj.current.pause();
        console.log('beep');
        playSound('beep');
      } catch (e) {
        console.log('Audio is still locked :(');
        setAudioLocked(true);
        console.log(e);
      }

      return;
    } 
  },[audioObj, mainSocket, setAudioLocked, audioLocked, playSound]);

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

      s.on('soundbuzz', (echo) => {
        console.log('got buzz');
        playSound('buzz');
      });

      s.on('tick', (data) => {
        setTimeRemain(data.timeRemain);
        setIsRunning(data.clockRunning);
        setSocketWatchdog(0); // all good, we're hearing heartbeats.
        setSocketError(null);
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
  
      s.on('timesup', (data) => {
        console.log('timesup');
        playSound("timeup");        
      });

      s.on('lastbuzz', (data) => {
        console.log(data);
        if (data !== null) {
          playSound('buzz');
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
  },[audioObj, mainSocket, timeRemain, lastBuzz, buzzerDisabled, user, setAudioLocked, audioLocked, playSound]);

  // render -------------------------------------------------------

  return (
    <BrowserRouter>
      <Route exact path="/">
        <HomePage 
          user={user}
          mainSocket={mainSocket}
          socketError={socketError}
          audioObj={audioObj.current}
          audioLocked={audioLocked}
          setAudioLockedCallback={setAudioLocked}
        />
      </Route>
      <Route exact path="/about">
        <AboutPage 
          user={user}
          mainSocket={mainSocket}
          socketError={socketError}
          timeRemain={timeRemain}
          isRunning={isRunning}
          lastBuzz={lastBuzz}
          buzzerDisabled={buzzerDisabled}
          scores={scores}
          audioObj={audioObj}
          audioLocked={audioLocked}
          setAudioLockedCallback={setAudioLocked}
        />
      </Route>
      <Route exact path="/privacy">
        <PrivacyPage 
          user={user}
          mainSocket={mainSocket}
          socketError={socketError}
          timeRemain={timeRemain}
          isRunning={isRunning}
          lastBuzz={lastBuzz}
          buzzerDisabled={buzzerDisabled}
          scores={scores}
          audioObj={audioObj}
          audioLocked={audioLocked}
          setAudioLockedCallback={setAudioLocked}
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
          audioObj={audioObj}
          audioLocked={audioLocked}
          setAudioLockedCallback={setAudioLocked}
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
          scores={scores}
          audioObj={audioObj}
          audioLocked={audioLocked}
          setAudioLockedCallback={setAudioLocked}
        />
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
          scores={scores}
          audioObj={audioObj}
          audioLocked={audioLocked}
          setAudioLockedCallback={setAudioLocked}
        />
      </Route>
      <Route exact path="/logout">
        <LogoutPage user/>
      </Route>
    </BrowserRouter>
  );
}

export default App;
