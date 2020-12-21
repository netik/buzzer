import React from "react";
import NavBar from "../../components/NavBar";
import DTHeader from "../../components/DTHeader";
import TimeClock from "../../components/TimeClock";
import ScoreBoard from "../../components/ScoreBoard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  Alert,
  Button,
  Container,
  Row,
  Col
} from "reactstrap";

const HostPage = (props) => {
  let sockErrorComp = null;

  const handleAddTime = () => {
    props.mainSocket.emit('addtime');
  };

  const handleSubTime = () => {
    props.mainSocket.emit('subtime');
  };

  // buttons
  const handleClear = () => {
   props.mainSocket.emit('clear')
  };

  const handleResetClock = () => {
    props.mainSocket.emit('resetclock')
  };

  const handleStartClock = () => {
    props.mainSocket.emit('startclock')
  };
  const handlePauseClock = () => {
    props.mainSocket.emit('pauseclock')
  };
  const handleResetScores = () => {
    props.mainSocket.emit('resetscores')
  };
  const handleSendBuzzer = () => {
    props.mainSocket.emit('soundbuzz')
  };
  
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
        latency={props.latency}
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

    <Container>
        <Row className="mb-0 mb-md-3 text-center">
      <Col>
    <Button 
       onClick={handleAddTime} 
       color="primary" 
       style={{"margin":"10px"}}>
      <FontAwesomeIcon icon="plus-circle"/> Add Time
    </Button>
    {' '}
    <Button 
      onClick={handleSubTime}
      color="primary" 
      style={{"margin":"10px"}}>
     <FontAwesomeIcon icon="minus-circle"/> Subtract Time
    </Button>
    {' '}
    <Button 
      onClick={handleStartClock} 
      color="success" 
      style={{"margin":"10px"}}>
     <FontAwesomeIcon icon="play"/> Start Clock
    </Button>
    {' '}
    <Button 
      onClick={handlePauseClock}
      color="danger"
      style={{"margin":"10px"}}>
      <FontAwesomeIcon icon="stop"/> Stop Clock
    </Button>
    {' '}
    <Button
      onClick={handleClear}
      color="info"
      style={{"margin":"10px"}}>
      <FontAwesomeIcon icon="circle"/> Clear Buzzes
    </Button>
    {' '}
    <Button
      onClick={handleResetClock}
      color="danger"
      style={{"margin":"10px"}}>
      <FontAwesomeIcon icon="trash"/> Reset Clock
    </Button>
    {' '}
    <Button
      onClick={handleResetScores}
      color="danger"
      style={{"margin":"10px"}}>
      <FontAwesomeIcon icon="trash"/> Reset Scores
    </Button>
    <Button
      onClick={handleSendBuzzer}
      color="danger"
      style={{"margin":"10px"}}>
      <FontAwesomeIcon icon="volume-up"/> Buzz Everyone
    </Button>
    </Col>
    </Row>
    </Container>
    <ScoreBoard 
      socket={props.mainSocket} 
      user={props.user} 
      scores={props.scores} 
      lastBuzz={props.lastBuzz}
      host={true}
      buzzerDisabled={props.buzzerDisabled}/>
</div>
)
}

export default HostPage;
