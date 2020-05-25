import React, { useState, useEffect } from "react";
import './App.css';
import io from 'socket.io-client';
import NavBar from "./NavBar";
import LoginBox from "./LoginBox";
import Buzzer from "./Buzzer";
import TimeClock from "./TimeClock";
import ScoreBoard from "./ScoreBoard";

const ENDPOINT="http://localhost:8090";

function App() {
  const [mainSocket, setMainSocket] = useState({});
  const [isOnline, setIsOnline] = useState(null);
  const [timeRemain, setTimeRemain] = useState(0);
  const [lastBuzz, setLastBuzz] = useState(null);
  const [buzzerDisabled, setBuzzerDisabled] = useState(true);
  const [user, setUser] = useState(null);
  
  // in this simple app the top-level App class will manage state and 
  // pass the socket down to children for communications with the server
  useEffect(() => { 
    if (! isOnline) {
      const s = io(ENDPOINT);
      setIsOnline(true);
      setMainSocket(s);

      // handle socket ops here and update game state
      s.on('connect', () => {
        console.log('connected');
      });

      s.on('tick', (data) => {
        setTimeRemain(data.timeRemain);
      });

      s.on('joined', (data) => {
        console.log('join ok!');
        console.log(data);
        setUser(data);
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
    }
  },[isOnline, timeRemain, lastBuzz, buzzerDisabled, user]);

  // still establishing a connection
  if (isOnline === null) { 
    return 'Loading...';
  }

  if (user !== null) { 
    return (
      <div className="App">
        <NavBar socket={mainSocket} user={user}/>
        <TimeClock 
          socket={mainSocket} 
          user={user} 
          timeRemain={timeRemain} 
          buzzerDisabled={buzzerDisabled}/>
        <ScoreBoard socket={mainSocket} user={user} buzzerDisabled={buzzerDisabled}/>
        <Buzzer socket={mainSocket} user={user} buzzerDisabled={buzzerDisabled}/>
     </div>
    );
  }

  return (
    <div className="App">
      <NavBar user={user} />
      <LoginBox socket={mainSocket} user={user}/>
    </div>
  );
}

export default App;
