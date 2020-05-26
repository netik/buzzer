import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col 
} from 'reactstrap';

const waitForHost = 'STOPPED - WAITING FOR HOST';

const TimeClock = (props) => {
  const formatTime = (t) => {
    const min = `${Math.floor(t / 60)}`;
    const sec = `${t - (min*60)}`;
  
    return `${min.padStart(2,'0')}:${sec.padStart(2,'0')}`; 
  };

  const [statusMessage, setStatusMessage] = useState(waitForHost);
  
  useEffect(() => {
    if (props.isRunning) {
      setStatusMessage('RUNNING');
    } else {
      setStatusMessage(waitForHost);
    } 
  }, [props.isRunning]);

  return (
    <Container>
    <Row>
      <Col className="text-center" sm="12">
       <div className="txt-jumbo">
         {formatTime(props.timeRemain)}
       </div>
       <h2 className="status-message">{statusMessage}</h2>
      </Col>
    </Row>
    </Container>
    );
}

export default TimeClock;