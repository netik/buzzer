import NavBar from "../components/NavBar";
import Buzzer from "../components/Buzzer";
import DTHeader from "../components/DTHeader";
import TimeClock from "../components/TimeClock";
import ScoreBoard from "../components/ScoreBoard";
import React from "react";
import {
  Redirect
} from "react-router-dom";

import {
  Alert
} from "reactstrap";

const GamePage = (props) => {
  let sockErrorComp = null;
  if (props.socketError != null) {
    sockErrorComp = (<Alert color="danger">{props.socketError}</Alert>);
  }
  
  if (!props.user) {
    return (
      <Redirect to='/'/>
    )
  }

  return (
    <div>
      <NavBar socket={props.mainSocket} user={props.user}/>
      {sockErrorComp}
      <DTHeader/>
      <TimeClock 
        socket={props.mainSocket} 
        user={props.user} 
        isRunning={props.isRunning}
        timeRemain={props.timeRemain} 
        buzzerDisabled={props.buzzerDisabled}/>
      <Buzzer 
        socket={props.mainSocket} 
        user={props.user} 
        buzzerDisabled={props.buzzerDisabled}/>
      <ScoreBoard 
        socket={props.mainSocket} 
        user={props.user} 
        scores={props.scores} 
        buzzerDisabled={props.buzzerDisabled}/>
    </div>
  );
}

export default GamePage;

