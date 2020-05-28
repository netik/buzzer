import React from "react";
import NavBar from "../components/NavBar";
import DTHeader from "../components/DTHeader";
import TimeClock from "../components/TimeClock";
import ScoreBoard from "../components/ScoreBoard";

import {
  Alert,
} from "reactstrap";

const ScorePage = (props) => {
  let sockErrorComp = null;

  if (props.socketError != null) {
    sockErrorComp = (<Alert color="danger">{props.socketError}</Alert>);
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

    <ScoreBoard 
      socket={props.mainSocket} 
      user={props.user} 
      scores={props.scores} 
      buzzerDisabled={props.buzzerDisabled}/>
</div>
)
}

export default ScorePage;
