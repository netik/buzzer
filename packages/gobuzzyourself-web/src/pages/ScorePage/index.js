import React from "react";
import NavBar from "../../components/NavBar";
import DTHeader from "../../components/DTHeader";
import TimeClock from "../../components/TimeClock";
import ScoreBoard from "../../components/ScoreBoard";

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
      <NavBar 
        user={props.user} 
        socket={props.mainSocket}
        audioObj={props.audioObj} 
        audioLocked={props.audioLocked}
        setAudioLockedCallback={props.setAudioLockedCallback}
      />
      {sockErrorComp}
      <DTHeader/>
      <TimeClock 
        socket={props.mainSocket} 
        user={props.user}
        lastBuzz={props.lastBuzz}
        isRunning={props.isRunning}
        timeRemain={props.timeRemain} 
        buzzerDisabled={props.buzzerDisabled}
      />
      <ScoreBoard 
        socket={props.mainSocket} 
        user={props.user} 
        scores={props.scores}
        lastBuzz={props.lastBuzz}
        buzzerDisabled={props.buzzerDisabled}
      />
    </div>
  )
}

export default ScorePage;
