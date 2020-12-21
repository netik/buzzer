import NavBar from "../../components/NavBar";
import LoginBox from "../../components/LoginBox";

import React from "react";
import {
  Redirect
} from "react-router-dom";

import {
  Alert
} from "reactstrap";

const HomePage = (props) => {
  let sockErrorComp = null;

  if (props.socketError != null) {
    sockErrorComp = (<Alert color="danger">{props.socketError}</Alert>);
  }

  // if we're logged in, bounce to the home page.
  if (props.user) {
    return (
      <Redirect to='/game'/>
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
        latency={props.latency}
      />

      {sockErrorComp}
      <LoginBox socket={props.mainSocket} user={props.user}/>
    </div>
  )
}

export default HomePage;
