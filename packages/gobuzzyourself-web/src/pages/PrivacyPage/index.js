import NavBar from "../../components/NavBar";
import Buzzer from "../../components/Buzzer";
import DTHeader from "../../components/DTHeader";
import TimeClock from "../../components/TimeClock";
import ScoreBoard from "../../components/ScoreBoard";
import React from "react";
import {
  Redirect
} from "react-router-dom";

import {
  Alert
} from "reactstrap";

const PrivacyPage = (props) => {
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
        buzzerDisabled={props.buzzerDisabled}/>
      <Buzzer 
        socket={props.mainSocket} 
        user={props.user} 
        buzzerDisabled={props.buzzerDisabled}/>
      <ScoreBoard 
        socket={props.mainSocket} 
        lastBuzz={props.lastBuzz}
        user={props.user} 
        scores={props.scores} 
        buzzerDisabled={props.buzzerDisabled}/>
    </div>
  );
}

export default PrivacyPage;

