import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col 
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const waitForHost = 'STOPPED - WAITING FOR HOST';

const TimeClock = (props) => {
  const formatTime = (t) => {
    const min = `${Math.floor(t / 60)}`;
    const sec = `${t - (min*60)}`;
  
    return `${min.padStart(2,'0')}:${sec.padStart(2,'0')}`; 
  };

  const [statusMessage, setStatusMessage] = useState(waitForHost);
  
  useEffect(() => {
    if (props.lastBuzz) {
      setStatusMessage(`${props.lastBuzz.name} buzzed in!`);
      return;
    }
    if (props.isRunning) {
      setStatusMessage('RUNNING');
    } else {
      setStatusMessage(waitForHost);
    } 
  }, [props.isRunning, props.lastBuzz]);

  return (
    <Container>
    <Row>
      <Col className="text-center" sm="12">
       <div className="txt-jumbo">
         <FontAwesomeIcon
           icon={props.isRunning === true ? "play" : "square"}
           style={props.isRunning === true ? {color:'#006600'} : {color:'#aa0000'}}
         />&nbsp;{formatTime(props.timeRemain)}
         
       </div>
       <h2 className="status-message">{statusMessage}</h2>
      </Col>
    </Row>
    </Container>
    );
}

export default TimeClock;