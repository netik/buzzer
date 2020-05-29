import React from "react";
import NavBar from "../components/NavBar";
import DTHeader from "../components/DTHeader";
import TimeClock from "../components/TimeClock";
import ScoreBoard from "../components/ScoreBoard";
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
      color="warning"
      style={{"margin":"10px"}}>
      <FontAwesomeIcon icon="pause"/> Pause Clock
    </Button>
    {' '}
    <Button
      onClick={handleClear}
      color="success"
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
